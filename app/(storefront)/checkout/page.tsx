import { LockKeyhole, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createCheckoutSession } from "./actions";
import { BookCover } from "@/components/book-cover";
import { Button } from "@/components/ui/button";
import { getCart } from "@/lib/cart/service";
import { formatPrice } from "@/lib/catalog/format";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { cancelled, payment_processing: paymentProcessing } = await searchParams;
  const items = await getCart();
  if (items.length === 0) redirect("/cart");
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:py-16">
    <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary">← Return to cart</Link>
    <h1 className="mt-5 font-serif text-4xl">Checkout</h1>
    {cancelled === "1" && <p className="mt-5 rounded-lg border border-accent bg-accent/10 px-4 py-3 text-sm">Checkout was cancelled. Your cart is still here when you are ready.</p>}
    {paymentProcessing === "1" && <p className="mt-5 rounded-lg border border-accent bg-accent/10 px-4 py-3 text-sm">Your payment is still being confirmed. Please wait a moment before trying again.</p>}
    <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_420px]">
      <section className="rounded-xl border bg-card p-6 sm:p-8"><div className="flex items-start gap-4"><span className="rounded-full bg-secondary p-3"><MapPin className="size-5 text-primary" /></span><div><h2 className="font-serif text-2xl">Contact and delivery</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Enter your email here. Stripe’s secure checkout will collect and validate your shipping address next.</p></div></div><form action={createCheckoutSession} className="mt-7"><label htmlFor="email" className="text-sm font-medium">Email address</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="reader@example.com" className="mt-2 h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" /><Button size="lg" className="mt-5 w-full"><LockKeyhole /> Continue to secure payment</Button></form><p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Payment details are handled by Stripe and never touch Folium’s servers.</p></section>
      <aside className="rounded-xl border bg-card p-6"><h2 className="font-serif text-2xl">Order summary</h2><ul className="mt-5 space-y-5">{items.map((item) => <li key={item.bookId} className="grid grid-cols-[52px_1fr_auto] gap-3"><BookCover src={item.coverImageUrl} title={item.title} className="w-[52px]" /><div><p className="font-medium leading-tight">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity}</p></div><p className="text-sm font-medium">{formatPrice(item.priceCents * item.quantity)}</p></li>)}</ul><div className="mt-6 flex justify-between border-t pt-5"><span className="text-muted-foreground">Total</span><span className="font-serif text-xl">{formatPrice(subtotal)}</span></div></aside>
    </div>
  </main>;
}
