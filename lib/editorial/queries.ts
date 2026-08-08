import "server-only";
import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  books,
  collectionBooks,
  collections,
  orderItems,
  orders,
  reviews,
  users,
} from "@/db/schema";

export async function getHomepageCollections() {
  const sections = await db
    .select()
    .from(collections)
    .where(eq(collections.isPublished, true))
    .orderBy(asc(collections.position));
  if (!sections.length) return [];
  const rows = await db
    .select({
      collectionId: collectionBooks.collectionId,
      id: books.id,
      title: books.title,
      slug: books.slug,
      author: books.author,
      priceCents: books.priceCents,
      format: books.format,
      coverImageUrl: books.coverImageUrl,
    })
    .from(collectionBooks)
    .innerJoin(books, eq(books.id, collectionBooks.bookId))
    .where(
      inArray(
        collectionBooks.collectionId,
        sections.map((section) => section.id),
      ),
    )
    .orderBy(asc(collectionBooks.position));
  return sections.map((section) => ({
    ...section,
    books: rows
      .filter((row) => row.collectionId === section.id)
      .map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        author: row.author,
        priceCents: row.priceCents,
        format: row.format,
        coverImageUrl: row.coverImageUrl,
        category: { name: section.title, slug: section.slug },
      })),
  }));
}

export function getApprovedReviews(bookId: string) {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      readerName: users.name,
    })
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.userId))
    .where(and(eq(reviews.bookId, bookId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function getRecommendations(bookId: string) {
  const source = alias(orderItems, "source_items");
  const related = alias(orderItems, "related_items");
  return db
    .select({
      id: books.id,
      title: books.title,
      slug: books.slug,
      author: books.author,
      priceCents: books.priceCents,
      format: books.format,
      coverImageUrl: books.coverImageUrl,
      count: sql<number>`count(*)::int`,
    })
    .from(source)
    .innerJoin(
      related,
      and(
        eq(related.orderId, source.orderId),
        ne(related.bookId, source.bookId),
      ),
    )
    .innerJoin(orders, eq(orders.id, source.orderId))
    .innerJoin(books, eq(books.id, related.bookId))
    .where(
      and(
        eq(source.bookId, bookId),
        inArray(orders.status, ["paid", "packed", "shipped", "delivered"]),
      ),
    )
    .groupBy(books.id)
    .orderBy(desc(sql`count(*)`))
    .limit(4);
}
