"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { removeFromCart, updateCartItem } from "@/app/(storefront)/cart/actions";
import { BookCover } from "@/components/book-cover";
import { Button } from "@/components/ui/button";
import type { CartLine } from "@/lib/cart/service";
import { formatPrice } from "@/lib/catalog/format";

export function CartDrawer({ items }: { items: CartLine[] }) {
  const [open, setOpen] = useState(false);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <>
    <button type="button" className="relative flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setOpen(true)} aria-label={`Open cart with ${itemCount} items`}>
      <ShoppingBag className="size-4" aria-hidden="true" /><span className="hidden sm:inline">Cart</span>
      {itemCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{itemCount}</span>}
    </button>
    {open && <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-foreground/25 backdrop-blur-[1px]" onClick={() => setOpen(false)} aria-label="Close cart" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-background shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="flex items-center justify-between border-b px-6 py-5"><div><h2 id="cart-title" className="font-serif text-2xl">Your cart</h2><p className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? "book" : "books"}</p></div><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close cart"><X /></Button></header>
        {items.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-8 text-center"><ShoppingBag className="size-10 text-muted-foreground" aria-hidden="true" /><p className="mt-5 font-serif text-xl">Your shelf is waiting.</p><p className="mt-2 text-sm text-muted-foreground">Browse the collection and add a book worth keeping.</p><Button asChild className="mt-6" onClick={() => setOpen(false)}><Link href="/books">Browse books</Link></Button></div> : <>
          <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-5">{items.map((item) => <li key={item.bookId} className="grid grid-cols-[64px_1fr] gap-4"><BookCover src={item.coverImageUrl} title={item.title} className="w-16" /><div className="min-w-0"><Link href={`/books/${item.slug}`} onClick={() => setOpen(false)} className="font-serif text-lg leading-tight hover:text-primary">{item.title}</Link><p className="mt-1 text-xs text-muted-foreground">{item.author}</p><div className="mt-3 flex items-center justify-between gap-2"><div className="flex items-center rounded-md border"><form action={item.quantity === 1 ? removeFromCart : updateCartItem}><input type="hidden" name="bookId" value={item.bookId} /><input type="hidden" name="quantity" value={item.quantity - 1} /><button className="p-2 text-muted-foreground hover:text-foreground" aria-label={item.quantity === 1 ? `Remove ${item.title}` : `Decrease ${item.title} quantity`}>{item.quantity === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}</button></form><span className="min-w-7 text-center text-sm">{item.quantity}</span><form action={updateCartItem}><input type="hidden" name="bookId" value={item.bookId} /><input type="hidden" name="quantity" value={item.quantity + 1} /><button className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40" disabled={item.quantity >= Math.min(item.stockQuantity, 20)} aria-label={`Increase ${item.title} quantity`}><Plus className="size-3.5" /></button></form></div><span className="font-medium">{formatPrice(item.priceCents * item.quantity)}</span></div></div></li>)}</ul>
          <footer className="border-t p-6"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-serif text-xl">{formatPrice(subtotal)}</span></div><p className="mt-2 text-xs text-muted-foreground">Shipping and taxes are calculated at checkout.</p><Button asChild size="lg" className="mt-5 w-full" onClick={() => setOpen(false)}><Link href="/checkout">Checkout</Link></Button><Button asChild variant="ghost" className="mt-2 w-full" onClick={() => setOpen(false)}><Link href="/cart">View cart</Link></Button></footer>
        </>}
      </aside>
    </div>}
  </>;
}
