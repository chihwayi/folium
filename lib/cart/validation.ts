import { z } from "zod";

export const cartItemInputSchema = z.object({
  bookId: z.uuid(),
  quantity: z.coerce.number().int().min(1).max(20),
});

export const cartCookieSchema = z
  .array(cartItemInputSchema)
  .max(50)
  .transform((items) =>
    items.map(({ bookId, quantity }) => ({ bookId, quantity })),
  );

export type CartCookieItem = z.infer<typeof cartItemInputSchema>;
