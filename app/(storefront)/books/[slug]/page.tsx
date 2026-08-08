import { Check, CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookCover } from "@/components/book-cover";
import { Button } from "@/components/ui/button";
import { formatBookFormat, formatPrice } from "@/lib/catalog/format";
import { getBookBySlug } from "@/lib/catalog/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Book not found | Folium" };
  return { title: `${book.title} by ${book.author} | Folium`, description: book.description, openGraph: { title: book.title, description: book.description ?? undefined, images: book.coverImageUrl ? [book.coverImageUrl] : [] } };
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();
  const inStock = book.stockQuantity > 0;
  const jsonLd = { "@context": "https://schema.org", "@type": ["Book", "Product"], name: book.title, author: { "@type": "Person", name: book.author }, description: book.description, image: book.coverImageUrl, isbn: book.isbn, bookFormat: book.format, offers: { "@type": "Offer", priceCurrency: "USD", price: (book.priceCents / 100).toFixed(2), availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 lg:py-16"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><nav className="text-sm text-muted-foreground"><Link href="/books" className="hover:text-primary">Books</Link> / <Link href={`/categories/${book.category.slug}`} className="hover:text-primary">{book.category.name}</Link></nav><div className="mt-8 grid gap-10 md:grid-cols-[minmax(260px,420px)_1fr] lg:gap-20"><BookCover src={book.coverImageUrl} title={book.title} /><article className="py-2"><p className="text-xs font-semibold tracking-[.2em] text-primary uppercase">{book.category.name}</p><h1 className="mt-3 font-serif text-5xl leading-tight font-medium text-balance">{book.title}</h1><p className="mt-3 text-xl text-muted-foreground">by {book.author}</p><div className="mt-8 flex items-center gap-4"><span className="font-serif text-3xl">{formatPrice(book.priceCents)}</span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{formatBookFormat(book.format)}</span></div><div className={`mt-5 flex items-center gap-2 text-sm ${inStock ? "text-primary" : "text-destructive"}`}>{inStock ? <Check className="size-4" /> : <CircleAlert className="size-4" />}{inStock ? `${book.stockQuantity} in stock` : "Currently out of stock"}</div><Button size="lg" className="mt-7 w-full sm:w-auto" disabled={!inStock}>{inStock ? "Add to cart" : "Unavailable"}</Button>{book.description && <div className="mt-10 border-t pt-8"><h2 className="font-serif text-2xl">About the book</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground whitespace-pre-line">{book.description}</p></div>}{book.sampleExcerpt && <blockquote className="mt-9 border-l-2 border-accent pl-6"><p className="font-serif text-xl leading-8 italic">“{book.sampleExcerpt}”</p><footer className="mt-3 text-xs tracking-widest text-muted-foreground uppercase">A glimpse inside</footer></blockquote>}<dl className="mt-10 grid grid-cols-2 gap-4 border-t pt-6 text-sm"><div><dt className="text-muted-foreground">Format</dt><dd className="mt-1 font-medium">{formatBookFormat(book.format)}</dd></div>{book.isbn && <div><dt className="text-muted-foreground">ISBN</dt><dd className="mt-1 font-medium">{book.isbn}</dd></div>}</dl></article></div></main>;
}
