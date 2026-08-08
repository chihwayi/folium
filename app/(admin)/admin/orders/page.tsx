import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog/format";
import { updateOrderStatus } from "../actions";

const next = { pending: ["paid", "cancelled"], paid: ["packed", "cancelled"], packed: ["shipped"], shipped: ["delivered"], delivered: [], cancelled: [] } as const;
export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const result = z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]).safeParse((await searchParams).status); const status = result.success ? result.data : undefined;
  const rows = status ? await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt)) : await db.select().from(orders).orderBy(desc(orders.createdAt));
  return <><h1 className="font-serif text-4xl">Orders</h1><nav className="mt-6 flex flex-wrap gap-2" aria-label="Order filters"><Button asChild size="sm" variant={!status ? "default" : "outline"}><Link href="/admin/orders">All</Link></Button>{Object.keys(next).map(value => <Button asChild size="sm" variant={status === value ? "default" : "outline"} key={value}><Link href={`/admin/orders?status=${value}`}>{value}</Link></Button>)}</nav><div className="mt-8 space-y-3">{rows.map(order => <section key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5"><div><p className="font-medium">{order.shippingName} · {formatPrice(order.totalCents)}</p><p className="mt-1 text-xs text-muted-foreground">{order.id.slice(0,8).toUpperCase()} · {order.customerEmail} · {order.status}</p></div><div className="flex gap-2">{next[order.status].map(status => <form action={updateOrderStatus} key={status}><input type="hidden" name="id" value={order.id}/><input type="hidden" name="status" value={status}/><Button size="sm" variant={status === "cancelled" ? "outline" : "default"}>{status}</Button></form>)}</div></section>)}</div></>;
}
