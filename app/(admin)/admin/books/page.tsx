import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { books, inventory } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog/format";
import { deleteBook, importBooks } from "../actions";

export default async function BooksPage() {
  const rows = await db.select({ id: books.id, title: books.title, author: books.author, price: books.priceCents, stock: inventory.stockQuantity }).from(books).innerJoin(inventory, eq(inventory.bookId, books.id)).orderBy(asc(books.title));
  return <><div className="flex items-end justify-between"><div><h1 className="font-serif text-4xl">Catalog</h1><p className="mt-2 text-sm text-muted-foreground">Create, edit, and import books.</p></div><Button asChild><Link href="/admin/books/new">Add book</Link></Button></div><form action={importBooks} className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4"><input type="file" name="file" accept=".csv,text/csv" required/><Button variant="outline">Import CSV</Button><span className="text-xs text-muted-foreground">Headers: title, slug, author, description, priceCents, categoryId, format, isbn, stockQuantity, coverImageUrl</span></form><div className="mt-8 divide-y rounded-xl border bg-card">{rows.map(book => <div key={book.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-medium">{book.title}</p><p className="text-sm text-muted-foreground">{book.author} · {formatPrice(book.price)} · {book.stock} in stock</p></div><div className="flex gap-2"><Button asChild size="sm" variant="outline"><Link href={`/admin/books/${book.id}`}>Edit</Link></Button><form action={deleteBook}><input type="hidden" name="id" value={book.id}/><Button size="sm" variant="destructive">Delete</Button></form></div></div>)}</div></>;
}
