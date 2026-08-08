"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCart } from "@/lib/cart/service";
import { getCurrentUserId } from "@/lib/cart/current-user";
import { getStorefrontUrl, getStripeClient } from "@/lib/payments/stripe";
import { validatePromoCode } from "@/lib/promotions/validate";

const checkoutSchema = z.object({
  email: z.email(),
  promoCode: z.string().max(32).optional(),
});

export type CheckoutState = { error: string } | null;

export async function createCheckoutSession(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email address" };
  const { email, promoCode } = parsed.data;
  const cart = await getCart();
  if (cart.length === 0) redirect("/cart");

  const unavailable = cart.find((item) => item.quantity > item.stockQuantity);
  if (unavailable)
    return { error: `${unavailable.title} no longer has enough stock` };

  const userId = await getCurrentUserId();
  const origin = getStorefrontUrl();
  const subtotalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );
  let discount;
  try {
    discount = await validatePromoCode(promoCode, subtotalCents);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "That promo code can't be applied" };
  }
  const stripe = getStripeClient();
  const coupon = discount
    ? await stripe.coupons.create({
        duration: "once",
        amount_off: discount.discountCents,
        currency: "usd",
        name: discount.promo.code,
      })
    : null;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: cart.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.priceCents,
        product_data: {
          name: item.title,
          description: `by ${item.author}`,
          ...(item.coverImageUrl ? { images: [item.coverImageUrl] } : {}),
          metadata: { bookId: item.bookId },
        },
      },
    })),
    metadata: {
      ...(userId ? { userId } : {}),
      ...(discount
        ? {
            promoCodeId: discount.promo.id,
            discountCents: String(discount.discountCents),
          }
        : {}),
    },
    ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "NZ", "ZA"],
    },
    success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?cancelled=1`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}
