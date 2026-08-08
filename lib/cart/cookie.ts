import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { cartCookieSchema, type CartCookieItem } from "./validation";

const CART_COOKIE_NAME = "folium_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getSigningSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required to sign guest carts");
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

function encode(items: CartCookieItem[]) {
  const payload = Buffer.from(JSON.stringify(items)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(value: string | undefined): CartCookieItem[] {
  if (!value) return [];

  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra) return [];

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return [];

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString());
    const result = cartCookieSchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export async function readGuestCart() {
  return decode((await cookies()).get(CART_COOKIE_NAME)?.value);
}

export async function writeGuestCart(items: CartCookieItem[]) {
  const validated = cartCookieSchema.parse(items);
  (await cookies()).set(CART_COOKIE_NAME, encode(validated), {
    httpOnly: true,
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearGuestCart() {
  (await cookies()).delete(CART_COOKIE_NAME);
}
