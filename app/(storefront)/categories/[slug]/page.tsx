import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookGrid } from "@/components/book-grid";
import { getAuthors, getCatalog, getCategories } from "@/lib/catalog/queries";
import { catalogSearchParamsSchema } from "@/lib/catalog/validation";
import { CatalogFiltersForm } from "../../books/_components/catalog-filters";
import { Pagination } from "../../books/_components/pagination";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> { const { slug } = await params; const categories = await getCategories(); const category = categories.find((item) => item.slug === slug); return { title: category ? `${category.name} Books | Folium` : "Collection not found | Folium", description: category?.description }; }
export default async function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) { const [{ slug }, raw] = await Promise.all([params, searchParams]); const categories = await getCategories(); const category = categories.find((item) => item.slug === slug); if (!category) notFound(); const filters = catalogSearchParamsSchema.parse({ ...raw, category: slug }); const [{ books, total, pages }, authors] = await Promise.all([getCatalog(filters), getAuthors()]); return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12"><div className="max-w-3xl"><p className="text-xs font-semibold tracking-widest text-primary uppercase">A Folium collection</p><h1 className="mt-2 font-serif text-5xl">{category.name}</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">{category.description ?? `Explore our curated ${category.name.toLowerCase()} shelf.`}</p><p className="mt-3 text-sm text-muted-foreground">{total} {total === 1 ? "book" : "books"}</p></div><div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]"><CatalogFiltersForm categories={categories} authors={authors} values={filters} hideCategory /><section><BookGrid books={books} /><Pagination page={filters.page} pages={pages} searchParams={raw} /></section></div></main>; }
