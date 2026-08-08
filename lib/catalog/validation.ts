import { z } from "zod";

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const optionalText = z.preprocess(firstValue, z.string().trim().min(1).optional());
const optionalMoney = z.preprocess(
  (value) => {
    const text = firstValue(value as string | string[] | undefined);
    return text === undefined || text === "" ? undefined : Number(text);
  },
  z.number().nonnegative().finite().optional(),
);

export const catalogSearchParamsSchema = z
  .object({
    page: z.preprocess(
      (value) => Number(firstValue(value as string | string[] | undefined) ?? 1),
      z.number().int().positive().catch(1),
    ),
    category: optionalText,
    author: optionalText,
    format: z.preprocess(
      firstValue,
      z.enum(["paperback", "hardcover", "ebook"]).optional(),
    ),
    minPrice: optionalMoney,
    maxPrice: optionalMoney,
    sort: z.preprocess(
      firstValue,
      z
        .enum(["curated", "newest", "price-asc", "price-desc", "bestselling"])
        .catch("curated"),
    ),
  })
  .transform((value) => ({
    ...value,
    minPrice: value.minPrice === undefined ? undefined : Math.round(value.minPrice * 100),
    maxPrice: value.maxPrice === undefined ? undefined : Math.round(value.maxPrice * 100),
  }));

export const searchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100),
});
