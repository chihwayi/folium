import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/catalog/queries";

export const metadata: Metadata = { title: "Collections | Folium" };
export const dynamic = "force-dynamic";
export default async function CategoriesPage() { const categories = await getCategories(); return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-14"><p className="text-xs font-semibold tracking-widest text-primary uppercase">Collections</p><h1 className="mt-2 font-serif text-5xl">Browse every shelf</h1><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category, index) => <Link key={category.id} href={`/categories/${category.slug}`} className="group min-h-52 rounded-xl border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="font-serif text-6xl text-accent/60">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-8 font-serif text-2xl group-hover:text-primary">{category.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description ?? "A thoughtfully arranged shelf of books worth your time."}</p></Link>)}</div></main>; }
