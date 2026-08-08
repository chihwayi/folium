import { BookCard } from "@/components/book-card";
import type { CatalogBook } from "@/lib/catalog/types";

export function BookGrid({ books }: { books: CatalogBook[] }) {
  if (!books.length) return <div className="rounded-xl border border-dashed p-12 text-center"><h2 className="font-serif text-2xl">No books on this shelf</h2><p className="mt-2 text-muted-foreground">Try widening your filters or exploring another collection.</p></div>;
  return <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">{books.map((book) => <BookCard key={book.id} book={book} />)}</div>;
}
