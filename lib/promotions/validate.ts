import "server-only";

import { and, eq, gt, isNull, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { promoCodes } from "@/db/schema";

export const promoCodeInput = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9][A-Z0-9_-]{2,31}$/);

export async function validatePromoCode(
  rawCode: string | undefined,
  subtotalCents: number,
) {
  if (!rawCode?.trim()) return null;
  const code = promoCodeInput.parse(rawCode);
  const now = new Date();
  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(
      and(
        eq(promoCodes.code, code),
        eq(promoCodes.isActive, true),
        or(isNull(promoCodes.expiresAt), gt(promoCodes.expiresAt, now)),
      ),
    )
    .limit(1);
  if (
    !promo ||
    (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit)
  )
    throw new Error("This promo code is invalid, expired, or fully redeemed");
  const discountCents =
    promo.type === "percentage"
      ? Math.floor((subtotalCents * promo.value) / 100)
      : promo.value;
  if (discountCents <= 0 || discountCents >= subtotalCents)
    throw new Error("This promo code cannot be applied to this order");
  return { promo, discountCents };
}
