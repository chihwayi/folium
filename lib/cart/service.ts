import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { books, cartItems, carts, inventory } from "@/db/schema";

import { readGuestCart, writeGuestCart } from "./cookie";
import { getCurrentUserId } from "./current-user";
import type { CartCookieItem } from "./validation";

export type CartLine = {
  bookId: string;
  slug: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  priceCents: number;
  stockQuantity: number;
  quantity: number;
};

async function readStoredItems(): Promise<CartCookieItem[]> {
  const userId = await getCurrentUserId();
  if (!userId) return readGuestCart();

  return db
    .select({ bookId: cartItems.bookId, quantity: cartItems.quantity })
    .from(carts)
    .innerJoin(cartItems, eq(cartItems.cartId, carts.id))
    .where(eq(carts.userId, userId));
}

async function writeStoredItems(items: CartCookieItem[]) {
  const userId = await getCurrentUserId();
  if (!userId) return writeGuestCart(items);

  await db.transaction(async (tx) => {
    const [cart] = await tx
      .insert(carts)
      .values({ userId })
      .onConflictDoUpdate({ target: carts.userId, set: { updatedAt: new Date() } })
      .returning({ id: carts.id });

    await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    if (items.length > 0) {
      await tx.insert(cartItems).values(items.map((item) => ({ cartId: cart.id, ...item })));
    }
  });
}

export async function getCart(): Promise<CartLine[]> {
  const storedItems = await readStoredItems();
  if (storedItems.length === 0) return [];

  const rows = await db
    .select({
      bookId: books.id,
      slug: books.slug,
      title: books.title,
      author: books.author,
      coverImageUrl: books.coverImageUrl,
      priceCents: books.priceCents,
      stockQuantity: inventory.stockQuantity,
    })
    .from(books)
    .innerJoin(inventory, eq(inventory.bookId, books.id))
    .where(inArray(books.id, storedItems.map((item) => item.bookId)));

  const byId = new Map(rows.map((row) => [row.bookId, row]));
  return storedItems.flatMap((item) => {
    const book = byId.get(item.bookId);
    return book ? [{ ...book, quantity: item.quantity }] : [];
  });
}

export async function setCartItem(bookId: string, quantity: number) {
  const [stock] = await db
    .select({ stockQuantity: inventory.stockQuantity })
    .from(books)
    .innerJoin(inventory, eq(inventory.bookId, books.id))
    .where(and(eq(books.id, bookId), eq(inventory.bookId, bookId)))
    .limit(1);

  if (!stock) throw new Error("Book not found");
  if (quantity > stock.stockQuantity) throw new Error("Requested quantity is not in stock");

  const items = await readStoredItems();
  const next = items.filter((item) => item.bookId !== bookId);
  if (quantity > 0) next.push({ bookId, quantity });
  await writeStoredItems(next);
}

export async function addCartItem(bookId: string, quantity: number) {
  const items = await readStoredItems();
  const currentQuantity = items.find((item) => item.bookId === bookId)?.quantity ?? 0;
  await setCartItem(bookId, currentQuantity + quantity);
}

export async function removeCartItem(bookId: string) {
  const items = await readStoredItems();
  await writeStoredItems(items.filter((item) => item.bookId !== bookId));
}

export async function clearCart() {
  await writeStoredItems([]);
}
