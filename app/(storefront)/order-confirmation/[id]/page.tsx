import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatPrice } from "@/lib/catalog/format";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: PageProps<"/order-confirmation/[id]">) {
  const { id } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) notFound();

  return <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-16"><section className="w-full rounded-xl border bg-card p-8 text-center sm:p-12"><CheckCircle2 className="mx-auto size-12 text-primary" /><p className="mt-6 text-xs font-semibold tracking-[.2em] text-primary uppercase">Payment received</p><h1 className="mt-2 font-serif text-4xl">Your books are on their way.</h1><p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">We sent a confirmation to your checkout email. Your order total is {formatPrice(order.totalCents)}.</p><dl className="mx-auto mt-8 grid max-w-md gap-4 border-y py-5 text-left text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Order reference</dt><dd className="mt-1 font-mono">{order.id.slice(0, 8).toUpperCase()}</dd></div><div><dt className="text-muted-foreground">Status</dt><dd className="mt-1 capitalize">{order.status}</dd></div></dl><Button asChild className="mt-8"><Link href="/books">Continue browsing</Link></Button></section></main>;
}
