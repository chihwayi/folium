import { and, asc, count, desc, eq, gte, ilike, lte, type SQL } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { books, categories, inventory } from "@/db/schema";
import type { CatalogBook, CatalogFilters } from "./types";

export const BOOKS_PER_PAGE = 12;

const selection = {
  id: books.id,
  title: books.title,
  slug: books.slug,
  author: books.author,
  description: books.description,
  sampleExcerpt: books.sampleExcerpt,
  priceCents: books.priceCents,
  coverImageUrl: books.coverImageUrl,
  isbn: books.isbn,
  format: books.format,
  publishedAt: books.publishedAt,
  createdAt: books.createdAt,
  curatedPosition: books.curatedPosition,
  categoryName: categories.name,
  categorySlug: categories.slug,
  stockQuantity: inventory.stockQuantity,
};

type CatalogRow = Record<keyof typeof selection, unknown>;

function toCatalogBook(row: CatalogRow): CatalogBook {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    author: row.author as string,
    description: row.description as string | null,
    sampleExcerpt: row.sampleExcerpt as string | null,
    priceCents: row.priceCents as number,
    coverImageUrl: row.coverImageUrl as string | null,
    isbn: row.isbn as string | null,
    format: row.format as CatalogBook["format"],
    publishedAt: row.publishedAt as Date | null,
    createdAt: row.createdAt as Date,
    curatedPosition: row.curatedPosition as number,
    category: { name: row.categoryName as string, slug: row.categorySlug as string },
    stockQuantity: (row.stockQuantity as number | null) ?? 0,
  };
}

function whereFor(filters: CatalogFilters) {
  const clauses: SQL[] = [];
  if (filters.category) clauses.push(eq(categories.slug, filters.category));
  if (filters.author) clauses.push(ilike(books.author, `%${filters.author}%`));
  if (filters.format) clauses.push(eq(books.format, filters.format));
  if (filters.minPrice !== undefined) clauses.push(gte(books.priceCents, filters.minPrice));
  if (filters.maxPrice !== undefined) clauses.push(lte(books.priceCents, filters.maxPrice));
  return clauses.length ? and(...clauses) : undefined;
}

function orderFor(sort: CatalogFilters["sort"]) {
  switch (sort) {
    case "newest": return [desc(books.publishedAt), desc(books.createdAt)];
    case "price-asc": return [asc(books.priceCents), asc(books.title)];
    case "price-desc": return [desc(books.priceCents), asc(books.title)];
    // Sales data lands in Sprint 3; curated order is the documented placeholder.
    case "bestselling":
    case "curated":
    default: return [asc(books.curatedPosition), asc(books.title)];
  }
}

export async function getCatalog(filters: CatalogFilters) {
  const where = whereFor(filters);
  const offset = (filters.page - 1) * BOOKS_PER_PAGE;
  const [rows, totals] = await Promise.all([
    db.select(selection).from(books).innerJoin(categories, eq(books.categoryId, categories.id))
      .leftJoin(inventory, eq(inventory.bookId, books.id)).where(where)
      .orderBy(...orderFor(filters.sort)).limit(BOOKS_PER_PAGE).offset(offset),
    db.select({ value: count() }).from(books)
      .innerJoin(categories, eq(books.categoryId, categories.id)).where(where),
  ]);
  const total = totals[0]?.value ?? 0;
  return { books: rows.map((row) => toCatalogBook(row)), total, pages: Math.max(1, Math.ceil(total / BOOKS_PER_PAGE)) };
}

export const getBookBySlug = cache(async (slug: string) => {
  const rows = await db.select(selection).from(books)
    .innerJoin(categories, eq(books.categoryId, categories.id))
    .leftJoin(inventory, eq(inventory.bookId, books.id))
    .where(eq(books.slug, slug)).limit(1);
  return rows[0] ? toCatalogBook(rows[0]) : null;
});

export const getCategories = cache(async () =>
  db.select({ id: categories.id, name: categories.name, slug: categories.slug, description: categories.description })
    .from(categories).orderBy(asc(categories.name)),
);

export const getAuthors = cache(async () =>
  db.selectDistinct({ author: books.author }).from(books).orderBy(asc(books.author)),
);
