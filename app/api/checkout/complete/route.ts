import { NextResponse } from "next/server";
import { z } from "zod";

import { clearCart } from "@/lib/cart/service";
import { fulfillCheckout } from "@/lib/orders/fulfill-checkout";

const querySchema = z.object({ session_id: z.string().startsWith("cs_") });

export async function GET(request: Request) {
  const input = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!input.success) return NextResponse.redirect(new URL("/checkout", request.url));

  try {
    const orderId = await fulfillCheckout(input.data.session_id);
    await clearCart();
    return NextResponse.redirect(new URL(`/order-confirmation/${orderId}`, request.url));
  } catch (error) {
    console.error("Checkout completion failed", error);
    return NextResponse.redirect(new URL("/checkout?payment_processing=1", request.url));
  }
}
