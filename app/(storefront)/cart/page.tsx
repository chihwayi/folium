import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

import { removeFromCart, updateCartItem } from "./actions";
import { BookCover } from "@/components/book-cover";
import { Button } from "@/components/ui/button";
import { getCart } from "@/lib/cart/service";
import { formatPrice } from "@/lib/catalog/format";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const items = await getCart();
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:py-16">
    <p className="text-xs font-semibold tracking-[.2em] text-primary uppercase">Your selection</p>
    <h1 className="mt-2 font-serif text-4xl">Shopping cart</h1>
    {items.length === 0 ? <section className="mt-12 rounded-xl border bg-card px-6 py-16 text-center"><ShoppingBag className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-5 font-serif text-2xl">Your cart is empty</h2><p className="mt-2 text-muted-foreground">A good shelf always has room for one more story.</p><Button asChild className="mt-6"><Link href="/books">Browse books</Link></Button></section> : <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y border-y">{items.map((item) => <li key={item.bookId} className="grid grid-cols-[80px_1fr] gap-5 py-6 sm:grid-cols-[96px_1fr_auto]"><BookCover src={item.coverImageUrl} title={item.title} className="w-20 sm:w-24" /><div><Link href={`/books/${item.slug}`} className="font-serif text-xl hover:text-primary">{item.title}</Link><p className="mt-1 text-sm text-muted-foreground">{item.author}</p><p className="mt-2 text-sm">{formatPrice(item.priceCents)} each</p><div className="mt-4 flex items-center gap-3"><form action={updateCartItem} className="flex items-center gap-2"><input type="hidden" name="bookId" value={item.bookId} /><label htmlFor={`quantity-${item.bookId}`} className="text-sm text-muted-foreground">Qty</label><select id={`quantity-${item.bookId}`} name="quantity" defaultValue={item.quantity} className="h-9 rounded-md border bg-background px-2 text-sm" aria-label={`Quantity for ${item.title}`}>{Array.from({ length: Math.min(item.stockQuantity, 20) }, (_, index) => index + 1).map((quantity) => <option key={quantity}>{quantity}</option>)}</select><Button size="sm" variant="outline">Update</Button></form><form action={removeFromCart}><input type="hidden" name="bookId" value={item.bookId} /><Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive"><Trash2 /> Remove</Button></form></div></div><p className="col-start-2 font-serif text-xl sm:col-start-3 sm:row-start-1">{formatPrice(item.priceCents * item.quantity)}</p></li>)}</ul>
      <aside className="h-fit rounded-xl border bg-card p-6"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-5 flex justify-between border-b pb-5"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Shipping and taxes are calculated securely during checkout.</p><Button asChild size="lg" className="mt-6 w-full"><Link href="/checkout">Continue to checkout</Link></Button></aside>
    </div>}
  </main>;
}
