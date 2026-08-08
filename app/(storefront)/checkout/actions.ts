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

export async function createCheckoutSession(formData: FormData) {
  const { email, promoCode } = checkoutSchema.parse(
    Object.fromEntries(formData),
  );
  const cart = await getCart();
  if (cart.length === 0) redirect("/cart");

  const unavailable = cart.find((item) => item.quantity > item.stockQuantity);
  if (unavailable)
    throw new Error(`${unavailable.title} no longer has enough stock`);

  const userId = await getCurrentUserId();
  const origin = getStorefrontUrl();
  const subtotalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );
  const discount = await validatePromoCode(promoCode, subtotalCents);
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
