"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { reviews, wishlists } from "@/db/schema";
import { getCurrentUserId } from "@/lib/cart/current-user";

const reviewSchema = z.object({
  bookId: z.uuid(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(),
  body: z.string().trim().min(10).max(2000),
});
export async function submitReview(formData: FormData) {
  const input = reviewSchema.parse(Object.fromEntries(formData));
  const userId = await getCurrentUserId();
  if (!userId) redirect(`/login?callbackUrl=/books/${input.slug}`);
  await db
    .insert(reviews)
    .values({
      bookId: input.bookId,
      userId,
      rating: input.rating,
      title: input.title || null,
      body: input.body,
    })
    .onConflictDoUpdate({
      target: [reviews.bookId, reviews.userId],
      set: {
        rating: input.rating,
        title: input.title || null,
        body: input.body,
        isApproved: false,
        updatedAt: new Date(),
      },
    });
  revalidatePath(`/books/${input.slug}`);
}

const wishlistSchema = z.object({
  bookId: z.uuid(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
});
export async function toggleWishlist(formData: FormData) {
  const userId = await getCurrentUserId();
  const input = wishlistSchema.parse(Object.fromEntries(formData));
  if (!userId) redirect(`/login?callbackUrl=/books/${input.slug}`);
  const existing = await db
    .select({ id: wishlists.id })
    .from(wishlists)
    .where(
      and(eq(wishlists.userId, userId), eq(wishlists.bookId, input.bookId)),
    )
    .limit(1);
  if (existing[0])
    await db.delete(wishlists).where(eq(wishlists.id, existing[0].id));
  else await db.insert(wishlists).values({ userId, bookId: input.bookId });
  revalidatePath(`/books/${input.slug}`);
  revalidatePath("/account/wishlist");
}
