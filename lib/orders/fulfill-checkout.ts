import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";
import Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db";
import { inventory, orderItems, orders, promoCodes } from "@/db/schema";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { getStripeClient } from "@/lib/payments/stripe";

const bookIdSchema = z.uuid();
const userIdSchema = z.uuid();
const promoMetadataSchema = z.object({
  promoCodeId: z.uuid(),
  discountCents: z.coerce.number().int().positive(),
});
const shippingAddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().nullable(),
  city: z.string().min(1),
  state: z.string().nullable(),
  postal_code: z.string().min(1),
  country: z.string().min(2),
});

type PaidLine = { bookId: string; quantity: number; unitPriceCents: number };

async function loadPaidSession(sessionId: string) {
  return getStripeClient().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });
}

function parseLines(session: Stripe.Checkout.Session): PaidLine[] {
  const lines = session.line_items?.data;
  if (!lines?.length) throw new Error("Checkout Session has no line items");

  return lines.map((line) => {
    const product = line.price?.product;
    const productObject =
      typeof product === "string" || !product || product.deleted
        ? null
        : product;
    const bookId = bookIdSchema.parse(productObject?.metadata.bookId);
    const quantity = z.number().int().positive().max(20).parse(line.quantity);
    const unitPriceCents = z
      .number()
      .int()
      .nonnegative()
      .parse(line.price?.unit_amount);
    return { bookId, quantity, unitPriceCents };
  });
}

export async function fulfillCheckout(sessionId: string) {
  const [existing] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.stripeCheckoutSessionId, sessionId))
    .limit(1);
  if (existing) {
    await sendOrderConfirmation(existing.id);
    return existing.id;
  }

  const session = await loadPaidSession(sessionId);
  if (session.mode !== "payment" || session.payment_status !== "paid")
    throw new Error("Checkout Session is not paid");

  const shipping = session.collected_information?.shipping_details;
  const email = session.customer_details?.email;
  const amountTotal = session.amount_total;
  if (!shipping || !email || amountTotal === null)
    throw new Error("Checkout Session is missing customer or shipping details");
  const address = shippingAddressSchema.parse(shipping.address);

  const lines = parseLines(session);
  const calculatedTotal = lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.quantity,
    0,
  );
  const promoResult = session.metadata?.promoCodeId
    ? promoMetadataSchema.safeParse(session.metadata)
    : null;
  const discountCents = promoResult?.success
    ? promoResult.data.discountCents
    : 0;
  if (calculatedTotal - discountCents !== amountTotal)
    throw new Error(
      "Checkout Session total does not match its line items and discount",
    );

  const userIdResult = session.metadata?.userId
    ? userIdSchema.safeParse(session.metadata.userId)
    : null;
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const orderId = await db.transaction(async (tx) => {
    const orderValues: typeof orders.$inferInsert = {
      userId: userIdResult?.success ? userIdResult.data : null,
      status: "paid",
      totalCents: amountTotal,
      discountCents,
      promoCodeId: promoResult?.success ? promoResult.data.promoCodeId : null,
      customerEmail: email,
      shippingName: shipping.name,
      shippingAddressLine1: address.line1,
      shippingAddressLine2: address.line2,
      shippingCity: address.city,
      shippingState: address.state,
      shippingPostalCode: address.postal_code,
      shippingCountry: address.country,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntent,
      paidAt: new Date(),
    };
    const [order] = await tx
      .insert(orders)
      .values(orderValues)
      .returning({ id: orders.id });

    if (promoResult?.success) {
      await tx
        .update(promoCodes)
        .set({
          usageCount: sql`${promoCodes.usageCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(promoCodes.id, promoResult.data.promoCodeId));
    }

    for (const line of lines) {
      const [updated] = await tx
        .update(inventory)
        .set({
          stockQuantity: sql`${inventory.stockQuantity} - ${line.quantity}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(inventory.bookId, line.bookId),
            gte(inventory.stockQuantity, line.quantity),
          ),
        )
        .returning({ id: inventory.id });
      if (!updated)
        throw new Error(`Insufficient inventory for book ${line.bookId}`);
    }

    await tx
      .insert(orderItems)
      .values(lines.map((line) => ({ orderId: order.id, ...line })));
    return order.id;
  });

  await sendOrderConfirmation(orderId);
  return orderId;
}
