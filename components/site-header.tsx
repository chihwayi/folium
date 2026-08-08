import { BookOpen, User } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { signOutAction } from "@/app/(auth)/actions";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchBar } from "@/components/search-bar";
import { getCart } from "@/lib/cart/service";

export async function SiteHeader() {
  const [cart, session] = await Promise.all([getCart(), auth()]);
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
          <Link href="/account/wishlist" className="hover:text-primary">Wishlist</Link>
        </nav>
        <div className="ml-auto w-full max-w-md"><SearchBar /></div>
        {session?.user ? (
          <div className="flex items-center gap-3 text-sm">
            <Link href="/account" className="flex items-center gap-1.5 hover:text-primary">
              <User className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{session.user.name ?? "Account"}</span>
            </Link>
            {(session.user.role === "staff" || session.user.role === "owner") && (
              <Link href="/admin" className="hidden text-muted-foreground hover:text-primary sm:inline">
                Admin
              </Link>
            )}
            <form action={signOutAction}>
              <button type="submit" className="text-muted-foreground hover:text-primary">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link href="/sign-in" className="text-sm hover:text-primary">
            Sign in
          </Link>
        )}
        <CartDrawer items={cart} />
      </div>
    </header>
  );
}
