import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { BookForm } from "../_components/book-form";

export default async function NewBookPage() {
  const options = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name));
  return <><h1 className="font-serif text-4xl">Add a book</h1><p className="mt-2 text-sm text-muted-foreground">Upload a cover and publish a new catalog title.</p>{options.length ? <BookForm categories={options}/> : <p className="mt-8 rounded-xl border p-6">Create a category before adding a book.</p>}</>;
}
