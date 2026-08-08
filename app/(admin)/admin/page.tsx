import { count, lte } from "drizzle-orm";

import { db } from "@/db";
import { books, inventory, orders } from "@/db/schema";

export default async function AdminPage() {
  const [[bookCount], [orderCount], [lowCount]] = await Promise.all([
    db.select({ value: count() }).from(books),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(inventory).where(lte(inventory.stockQuantity, inventory.lowStockThreshold)),
  ]);
  return <><p className="text-sm font-medium text-primary">Store operations</p><h1 className="mt-2 font-serif text-4xl">Overview</h1><div className="mt-8 grid gap-4 sm:grid-cols-3">{[["Books", bookCount.value], ["Orders", orderCount.value], ["Low stock", lowCount.value]].map(([label, value]) => <section key={label} className="rounded-xl border bg-card p-6"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-serif text-4xl">{value}</p></section>)}</div></>;
}
