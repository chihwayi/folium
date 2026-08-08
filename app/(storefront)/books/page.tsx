import type { Metadata } from "next";

import { BookGrid } from "@/components/book-grid";
import { getAuthors, getCatalog, getCategories } from "@/lib/catalog/queries";
import { catalogSearchParamsSchema } from "@/lib/catalog/validation";
import { CatalogFiltersForm } from "./_components/catalog-filters";
import { Pagination } from "./_components/pagination";

export const metadata: Metadata = { title: "Books | Folium", description: "Browse Folium's curated collection of books." };
export const dynamic = "force-dynamic";

export default async function BooksPage({ searchParams }: PageProps<"/books">) {
  const raw = await searchParams;
  const filters = catalogSearchParamsSchema.parse(raw);
  const [{ books, total, pages }, categories, authors] = await Promise.all([getCatalog(filters), getCategories(), getAuthors()]);
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12"><div className="max-w-2xl"><p className="text-xs font-semibold tracking-widest text-primary uppercase">The catalog</p><h1 className="mt-2 font-serif text-5xl">Find your next book</h1><p className="mt-4 text-muted-foreground">{total} carefully selected {total === 1 ? "title" : "titles"}, from old friends to unexpected discoveries.</p></div><div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]"><aside><CatalogFiltersForm categories={categories} authors={authors} values={filters} /></aside><section aria-label="Book results"><BookGrid books={books} /><Pagination page={filters.page} pages={pages} searchParams={raw} /></section></div></main>;
}
