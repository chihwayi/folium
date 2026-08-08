import { and, desc, inArray, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { books, inventory, orderItems, orders } from "@/db/schema";
import { formatPrice } from "@/lib/catalog/format";

const completedStatuses = ["paid", "packed", "shipped", "delivered"] as const;

export default async function AdminPage() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 29);
  since.setUTCHours(0, 0, 0, 0);

  const [[summary], trend, topBooks, lowStock] = await Promise.all([
    db
      .select({
        revenueCents: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
        discountCents: sql<number>`coalesce(sum(${orders.discountCents}), 0)::int`,
        orderCount: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(inArray(orders.status, completedStatuses)),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${orders.paidAt}), 'YYYY-MM-DD')`,
        revenueCents: sql<number>`sum(${orders.totalCents})::int`,
        orderCount: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(
        and(
          inArray(orders.status, completedStatuses),
          sql`${orders.paidAt} >= ${since}`,
        ),
      )
      .groupBy(sql`date_trunc('day', ${orders.paidAt})`)
      .orderBy(sql`date_trunc('day', ${orders.paidAt})`),
    db
      .select({
        id: books.id,
        title: books.title,
        quantity: sql<number>`sum(${orderItems.quantity})::int`,
        revenueCents: sql<number>`sum(${orderItems.unitPriceCents} * ${orderItems.quantity})::int`,
      })
      .from(orderItems)
      .innerJoin(orders, sql`${orders.id} = ${orderItems.orderId}`)
      .innerJoin(books, sql`${books.id} = ${orderItems.bookId}`)
      .where(inArray(orders.status, completedStatuses))
      .groupBy(books.id, books.title)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5),
    db
      .select({
        id: inventory.id,
        title: books.title,
        stock: inventory.stockQuantity,
        threshold: inventory.lowStockThreshold,
      })
      .from(inventory)
      .innerJoin(books, sql`${books.id} = ${inventory.bookId}`)
      .where(lte(inventory.stockQuantity, inventory.lowStockThreshold))
      .orderBy(inventory.stockQuantity)
      .limit(8),
  ]);
  const maxRevenue = Math.max(...trend.map((item) => item.revenueCents), 1);
  const averageOrder = summary.orderCount
    ? Math.round(summary.revenueCents / summary.orderCount)
    : 0;

  return (
    <div>
      <p className="text-sm font-medium text-primary">Store performance</p>
      <h1 className="mt-2 font-serif text-4xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Revenue", formatPrice(summary.revenueCents)],
          ["Paid orders", summary.orderCount],
          ["Average order", formatPrice(averageOrder)],
          ["Discounts", formatPrice(summary.discountCents)],
        ].map(([label, value]) => (
          <section key={label} className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </section>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-xl border bg-card p-6">
          <div>
            <h2 className="font-serif text-2xl">Revenue, last 30 days</h2>
            <p className="text-sm text-muted-foreground">
              Paid order volume and net revenue after promotions.
            </p>
          </div>
          {trend.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              Revenue will appear after the first paid order.
            </p>
          ) : (
            <div
              className="mt-8 flex h-64 items-end gap-2"
              aria-label="Daily revenue chart"
            >
              {trend.map((item) => (
                <div
                  key={item.day}
                  className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="sr-only">
                    {item.day}: {formatPrice(item.revenueCents)},{" "}
                    {item.orderCount} orders
                  </span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
                    style={{
                      height: `${Math.max(4, (item.revenueCents / maxRevenue) * 200)}px`,
                    }}
                    title={`${item.day}: ${formatPrice(item.revenueCents)} · ${item.orderCount} orders`}
                  />
                  <span className="hidden text-[10px] text-muted-foreground sm:block">
                    {item.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-xl border bg-card p-6">
          <h2 className="font-serif text-2xl">Low stock</h2>
          <div className="mt-5 space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Every title is above its threshold.
              </p>
            ) : (
              lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="truncate">{item.title}</span>
                  <span className="shrink-0 font-medium text-destructive">
                    {item.stock} / {item.threshold}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-xl border bg-card p-6">
        <h2 className="font-serif text-2xl">Top-selling books</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 text-right font-medium">Copies</th>
                <th className="pb-3 text-right font-medium">Gross sales</th>
              </tr>
            </thead>
            <tbody>
              {topBooks.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="py-3 font-medium">{book.title}</td>
                  <td className="py-3 text-right">{book.quantity}</td>
                  <td className="py-3 text-right">
                    {formatPrice(book.revenueCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {topBooks.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No paid book sales yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
