import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BookGrid } from "@/components/book-grid";
import { Button } from "@/components/ui/button";
import { getCatalog, getCategories } from "@/lib/catalog/queries";
import { getHomepageCollections } from "@/lib/editorial/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ books }, categories, collections] = await Promise.all([
    getCatalog({ page: 1, sort: "curated" }),
    getCategories(),
    getHomepageCollections(),
  ]);
  return (
    <main className="flex-1">
      <section className="border-b bg-secondary/45">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_.8fr] lg:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[.28em] text-primary uppercase">
              The independent shelf
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.05] font-medium text-balance sm:text-7xl">
              Stories selected for a life beyond the algorithm.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Discover enduring classics, sharp new voices, and beautiful
              editions chosen by readers who care about every page.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/books">
                Browse the collection <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="hidden rotate-2 rounded-sm border bg-card p-8 shadow-xl lg:block">
            <p className="font-serif text-3xl leading-relaxed">
              “A room without books is like a body without a soul.”
            </p>
            <p className="mt-8 text-sm tracking-widest text-muted-foreground uppercase">
              — Cicero
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Editor’s table
            </p>
            <h2 className="mt-2 font-serif text-4xl">Books to begin with</h2>
          </div>
          <Link
            href="/books"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-9">
          <BookGrid books={books.slice(0, 8)} />
        </div>
      </section>
      {collections.map((collection) => (
        <section
          className="mx-auto w-full max-w-7xl px-6 py-16"
          key={collection.id}
        >
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            {collection.eyebrow ?? "Curated at Folium"}
          </p>
          <h2 className="mt-2 font-serif text-4xl">{collection.title}</h2>
          {collection.description && (
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {collection.description}
            </p>
          )}
          <div className="mt-9">
            <BookGrid books={collection.books} />
          </div>
        </section>
      ))}
      <section className="border-y bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-xs tracking-widest uppercase opacity-70">
            Browse by mood
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="rounded-full border border-primary-foreground/30 px-5 py-2.5 font-serif text-lg transition hover:bg-primary-foreground hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
