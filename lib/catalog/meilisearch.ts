import { Meilisearch } from "meilisearch";

export const BOOKS_INDEX = "books";

export function getMeilisearchClient() {
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (!host) throw new Error("MEILISEARCH_HOST is not configured");
  return new Meilisearch({ host, apiKey });
}
