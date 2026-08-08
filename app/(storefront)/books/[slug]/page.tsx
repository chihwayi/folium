import { Check, CircleAlert, Heart, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookCover } from "@/components/book-cover";
import { BookGrid } from "@/components/book-grid";
import { Button } from "@/components/ui/button";
import { formatBookFormat, formatPrice } from "@/lib/catalog/format";
import { getBookBySlug } from "@/lib/catalog/queries";
import {
  getApprovedReviews,
  getRecommendations,
} from "@/lib/editorial/queries";
import { submitReview, toggleWishlist } from "./actions";

import { AddToCartForm } from "@/components/add-to-cart-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Book not found | Folium" };
  return {
    title: `${book.title} by ${book.author} | Folium`,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description ?? undefined,
      images: book.coverImageUrl ? [book.coverImageUrl] : [],
    },
  };
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();
  const [reviews, recommendations] = await Promise.all([
    getApprovedReviews(book.id),
    getRecommendations(book.id),
  ]);
  const inStock = book.stockQuantity > 0;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Book", "Product"],
    name: book.title,
    author: { "@type": "Person", name: book.author },
    description: book.description,
    image: book.coverImageUrl,
    isbn: book.isbn,
    bookFormat: book.format,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (book.priceCents / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
  const recommendationBooks = recommendations.map((item) => ({
    ...item,
    category: book.category,
  }));
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav className="text-sm text-muted-foreground">
        <Link href="/books" className="hover:text-primary">
          Books
        </Link>{" "}
        /{" "}
        <Link
          href={`/categories/${book.category.slug}`}
          className="hover:text-primary"
        >
          {book.category.name}
        </Link>
      </nav>
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(260px,420px)_1fr] lg:gap-20">
        <BookCover src={book.coverImageUrl} title={book.title} />
        <article className="py-2">
          <p className="text-xs font-semibold tracking-[.2em] text-primary uppercase">
            {book.category.name}
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-tight font-medium text-balance">
            {book.title}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">by {book.author}</p>
          <div className="mt-8 flex items-center gap-4">
            <span className="font-serif text-3xl">
              {formatPrice(book.priceCents)}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
              {formatBookFormat(book.format)}
            </span>
          </div>
          <div
            className={`mt-5 flex items-center gap-2 text-sm ${inStock ? "text-primary" : "text-destructive"}`}
          >
            {inStock ? (
              <Check className="size-4" />
            ) : (
              <CircleAlert className="size-4" />
            )}
            {inStock
              ? `${book.stockQuantity} in stock`
              : "Currently out of stock"}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <AddToCartForm bookId={book.id} inStock={inStock} />
            <form action={toggleWishlist}>
              <input type="hidden" name="bookId" value={book.id} />
              <input type="hidden" name="slug" value={book.slug} />
              <Button size="lg" variant="outline">
                <Heart /> Save for later
              </Button>
            </form>
          </div>
          {book.description && (
            <div className="mt-10 border-t pt-8">
              <h2 className="font-serif text-2xl">About the book</h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground whitespace-pre-line">
                {book.description}
              </p>
            </div>
          )}
          {book.sampleExcerpt && (
            <blockquote className="mt-9 border-l-2 border-accent pl-6">
              <p className="font-serif text-xl leading-8 italic">
                “{book.sampleExcerpt}”
              </p>
              <footer className="mt-3 text-xs tracking-widest text-muted-foreground uppercase">
                A glimpse inside
              </footer>
            </blockquote>
          )}
          <dl className="mt-10 grid grid-cols-2 gap-4 border-t pt-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Format</dt>
              <dd className="mt-1 font-medium">
                {formatBookFormat(book.format)}
              </dd>
            </div>
            {book.isbn && (
              <div>
                <dt className="text-muted-foreground">ISBN</dt>
                <dd className="mt-1 font-medium">{book.isbn}</dd>
              </div>
            )}
          </dl>
        </article>
      </div>
      <section className="mt-20 border-t pt-12">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Reader notes
        </p>
        <h2 className="mt-2 font-serif text-3xl">Reviews</h2>
        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <article
                  className="rounded-xl border bg-card p-5"
                  key={review.id}
                >
                  <div
                    className="flex text-accent"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: review.rating }, (_, index) => (
                      <Star className="size-4 fill-current" key={index} />
                    ))}
                  </div>
                  {review.title && (
                    <h3 className="mt-3 font-serif text-xl">{review.title}</h3>
                  )}
                  <p className="mt-2 leading-7 text-muted-foreground">
                    {review.body}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {review.readerName ?? "A Folium reader"}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-xl border bg-card p-8 text-muted-foreground">
                No published reviews yet. Be the first reader to leave a
                thoughtful note.
              </p>
            )}
          </div>
          <form
            action={submitReview}
            className="h-fit rounded-xl border bg-secondary/30 p-5"
          >
            <input type="hidden" name="bookId" value={book.id} />
            <input type="hidden" name="slug" value={book.slug} />
            <h3 className="font-serif text-xl">Share your reading</h3>
            <label className="mt-4 grid gap-2 text-sm">
              Rating
              <select
                className="h-10 rounded-md border bg-background px-3"
                name="rating"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} stars
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 grid gap-2 text-sm">
              Title
              <input
                className="h-10 rounded-md border bg-background px-3"
                name="title"
                maxLength={100}
              />
            </label>
            <label className="mt-3 grid gap-2 text-sm">
              Review
              <textarea
                className="min-h-28 rounded-md border bg-background p-3"
                name="body"
                minLength={10}
                maxLength={2000}
                required
              />
            </label>
            <Button className="mt-4">Submit for moderation</Button>
          </form>
        </div>
      </section>
      {recommendationBooks.length > 0 && (
        <section className="mt-20 border-t pt-12">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            On neighboring shelves
          </p>
          <h2 className="mt-2 font-serif text-3xl">Readers also bought</h2>
          <div className="mt-8">
            <BookGrid books={recommendationBooks} />
          </div>
        </section>
      )}
    </main>
  );
}
