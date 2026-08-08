"use client";

import { motion } from "framer-motion";

import { addToCart } from "@/app/(storefront)/cart/actions";
import { Button } from "@/components/ui/button";

export function AddToCartForm({ bookId, inStock }: { bookId: string; inStock: boolean }) {
  return (
    <form action={addToCart}>
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="quantity" value="1" />
      <motion.div whileTap={inStock ? { scale: 0.95 } : undefined} transition={{ type: "spring", stiffness: 500, damping: 28 }}>
        <Button size="lg" disabled={!inStock}>{inStock ? "Add to cart" : "Unavailable"}</Button>
      </motion.div>
    </form>
  );
}
