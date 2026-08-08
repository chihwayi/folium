"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addCartItem, removeCartItem, setCartItem } from "@/lib/cart/service";
import { cartItemInputSchema } from "@/lib/cart/validation";

const removeItemSchema = z.object({ bookId: z.uuid() });

function refreshCartViews() {
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function addToCart(formData: FormData) {
  const input = cartItemInputSchema.parse({
    bookId: formData.get("bookId"),
    quantity: formData.get("quantity") ?? 1,
  });
  await addCartItem(input.bookId, input.quantity);
  refreshCartViews();
}

export async function updateCartItem(formData: FormData) {
  const input = cartItemInputSchema.parse({
    bookId: formData.get("bookId"),
    quantity: formData.get("quantity"),
  });
  await setCartItem(input.bookId, input.quantity);
  refreshCartViews();
}

export async function removeFromCart(formData: FormData) {
  const input = removeItemSchema.parse({ bookId: formData.get("bookId") });
  await removeCartItem(input.bookId);
  refreshCartViews();
}
