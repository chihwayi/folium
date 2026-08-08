import Link from "next/link";

import { BookCover } from "@/components/book-cover";
import { formatBookFormat, formatPrice } from "@/lib/catalog/format";
import type { BookCardBook } from "@/lib/catalog/types";

export function BookCard({ book }: { book: BookCardBook }) {
  return (
    <article className="group min-w-0">
      <Link href={`/books/${book.slug}`} className="block focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
        <BookCover src={book.coverImageUrl} title={book.title} className="transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_42px_-18px_rgba(0,0,0,.75)]" />
        <div className="pt-4">
          <p className="text-xs font-medium tracking-wider text-primary uppercase">{book.category.name}</p>
          <h2 className="mt-1 truncate font-serif text-lg font-semibold group-hover:text-primary">{book.title}</h2>
          <p className="truncate text-sm text-muted-foreground">{book.author}</p>
          <div className="mt-3 flex items-center justify-between gap-2 text-sm">
            <span className="font-semibold">{formatPrice(book.priceCents)}</span>
            <span className="text-xs text-muted-foreground">{formatBookFormat(book.format)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
