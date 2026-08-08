import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/cart/current-user";
import { formatPrice } from "@/lib/catalog/format";
import { getOrdersForUser } from "@/lib/orders/queries";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in?callbackUrl=/account/orders");

  const orders = await getOrdersForUser(userId);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 lg:py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Your library</p>
      <h1 className="mt-3 font-serif text-4xl">My orders</h1>
      {orders.length === 0 ? (
        <section className="mt-10 rounded-xl border bg-card px-6 py-14 text-center">
          <PackageOpen className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your purchases will appear here after checkout.</p>
          <Link href="/books" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Browse books</Link>
        </section>
      ) : (
        <ul className="mt-8 divide-y rounded-xl border bg-card">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
              <div>
                <p className="font-medium">Order {order.id.slice(0, 8).toUpperCase()}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-lg">{formatPrice(order.totalCents)}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">{order.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
