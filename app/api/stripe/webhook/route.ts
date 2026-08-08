import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { fulfillCheckout } from "@/lib/orders/fulfill-checkout";
import { getStripeClient } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 400 });

  let event;
  try {
    event = getStripeClient().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await fulfillCheckout(event.data.object.id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook fulfillment failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
