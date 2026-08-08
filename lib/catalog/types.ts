export type BookFormat = "paperback" | "hardcover" | "ebook";

export type CatalogBook = {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string | null;
  sampleExcerpt: string | null;
  priceCents: number;
  coverImageUrl: string | null;
  isbn: string | null;
  format: BookFormat;
  publishedAt: Date | null;
  createdAt: Date;
  curatedPosition: number;
  category: { name: string; slug: string };
  stockQuantity: number;
};

export type CatalogFilters = {
  page: number;
  category?: string;
  author?: string;
  format?: BookFormat;
  minPrice?: number;
  maxPrice?: number;
  sort: "curated" | "newest" | "price-asc" | "price-desc" | "bestselling";
};
