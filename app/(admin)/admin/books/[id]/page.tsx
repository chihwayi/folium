import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { books, categories, inventory } from "@/db/schema";
import { BookForm } from "../_components/book-form";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const id = z.uuid().safeParse((await params).id); if (!id.success) notFound();
  const [options, rows] = await Promise.all([
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name)),
    db.select({ id: books.id, title: books.title, slug: books.slug, author: books.author, description: books.description, priceCents: books.priceCents, categoryId: books.categoryId, format: books.format, isbn: books.isbn, coverImageUrl: books.coverImageUrl, stockQuantity: inventory.stockQuantity }).from(books).innerJoin(inventory, eq(inventory.bookId, books.id)).where(eq(books.id, id.data)).limit(1),
  ]);
  if (!rows[0]) notFound();
  return <><h1 className="font-serif text-4xl">Edit book</h1><BookForm categories={options} book={rows[0]}/></>;
}
