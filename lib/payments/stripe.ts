import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  stripeClient ??= new Stripe(apiKey);
  return stripeClient;
}

export function getStorefrontUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL;
  if (!value) throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  return new URL(value).origin;
}
