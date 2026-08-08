import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { books, categories, inventory } from "@/db/schema";
import { BOOKS_INDEX, getMeilisearchClient } from "./meilisearch";

type Book = InferSelectModel<typeof books>;

export async function configureBooksIndex() {
  const index = getMeilisearchClient().index(BOOKS_INDEX);
  await Promise.all([
    index.updateSearchableAttributes(["title", "author", "description", "isbn"]),
    index.updateFilterableAttributes(["categorySlug", "author", "format", "priceCents"]),
    index.updateSortableAttributes(["priceCents", "publishedAt", "curatedPosition"]),
  ]);
}

export async function syncBookToSearch(book: Book) {
  const rows = await db.select({
    categoryName: categories.name,
    categorySlug: categories.slug,
    stockQuantity: inventory.stockQuantity,
  }).from(categories).leftJoin(inventory, eq(inventory.bookId, book.id))
    .where(eq(categories.id, book.categoryId)).limit(1);
  const related = rows[0];
  if (!related) throw new Error(`Cannot index book ${book.id}: category not found`);
  return getMeilisearchClient().index(BOOKS_INDEX).addDocuments([{
    ...book,
    categoryName: related.categoryName,
    categorySlug: related.categorySlug,
    stockQuantity: related.stockQuantity ?? 0,
    publishedAt: book.publishedAt?.toISOString() ?? null,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  }], { primaryKey: "id" });
}

export async function reindexCatalog() {
  await configureBooksIndex();
  const catalog = await db.select({
    book: books,
    categoryName: categories.name,
    categorySlug: categories.slug,
    stockQuantity: inventory.stockQuantity,
  }).from(books).innerJoin(categories, eq(categories.id, books.categoryId))
    .leftJoin(inventory, eq(inventory.bookId, books.id));

  if (catalog.length === 0) return null;

  return getMeilisearchClient().index(BOOKS_INDEX).addDocuments(catalog.map(({ book, ...related }) => ({
    ...book,
    ...related,
    stockQuantity: related.stockQuantity ?? 0,
    publishedAt: book.publishedAt?.toISOString() ?? null,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  })), { primaryKey: "id" });
}

export async function removeBookFromSearch(bookId: string) {
  return getMeilisearchClient().index(BOOKS_INDEX).deleteDocument(bookId);
}
