import { eq } from "drizzle-orm";
import { Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookGrid } from "@/components/book-grid";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { books, categories, wishlists } from "@/db/schema";
import { getCurrentUserId } from "@/lib/cart/current-user";
export const dynamic = "force-dynamic";
export default async function WishlistPage() {
  const userId = await getCurrentUserId(); if (!userId) redirect("/login?callbackUrl=/account/wishlist");
  const rows = await db.select({ id: books.id, title: books.title, slug: books.slug, author: books.author, priceCents: books.priceCents, format: books.format, coverImageUrl: books.coverImageUrl, category: { id: categories.id, name: categories.name, slug: categories.slug } }).from(wishlists).innerJoin(books, eq(books.id, wishlists.bookId)).innerJoin(categories, eq(categories.id, books.categoryId)).where(eq(wishlists.userId, userId));
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12"><h1 className="font-serif text-4xl">Saved for later</h1>{rows.length ? <div className="mt-8"><BookGrid books={rows}/></div> : <section className="mt-10 rounded-xl border bg-card py-16 text-center"><Heart className="mx-auto size-10 text-muted-foreground"/><h2 className="mt-4 font-serif text-2xl">Your wishlist is an open shelf</h2><p className="mt-2 text-muted-foreground">Save books here when they catch your eye.</p><Button asChild className="mt-6"><Link href="/books">Explore books</Link></Button></section>}</main>;
}
