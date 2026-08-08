import { BookOpen } from "lucide-react";
import Link from "next/link";

import { CartDrawer } from "@/components/cart-drawer";
import { SearchBar } from "@/components/search-bar";
import { getCart } from "@/lib/cart/service";

export async function SiteHeader() {
  const cart = await getCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-serif text-xl font-semibold tracking-tight">
          <BookOpen className="size-5 text-primary" aria-hidden="true" /> Folium
        </Link>
        <nav className="hidden items-center gap-5 text-sm md:flex" aria-label="Primary navigation">
          <Link href="/books" className="hover:text-primary">Books</Link>
          <Link href="/categories" className="hover:text-primary">Collections</Link>
          <Link href="/account/orders" className="hover:text-primary">Orders</Link>
        </nav>
        <div className="ml-auto w-full max-w-md"><SearchBar /></div>
        <CartDrawer items={cart} />
      </div>
    </header>
  );
}
