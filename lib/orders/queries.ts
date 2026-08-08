import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders } from "@/db/schema";

export async function getOrdersForUser(userId: string) {
  return db
    .select({
      id: orders.id,
      status: orders.status,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}
