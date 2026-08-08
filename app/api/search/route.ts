import { NextResponse } from "next/server";
import { BOOKS_INDEX, getMeilisearchClient } from "@/lib/catalog/meilisearch";
import { searchQuerySchema } from "@/lib/catalog/validation";

export async function GET(request: Request) { const url = new URL(request.url); const parsed = searchQuerySchema.safeParse({ q: url.searchParams.get("q") }); if (!parsed.success) return NextResponse.json({ hits: [] }); try { const result = await getMeilisearchClient().index(BOOKS_INDEX).search(parsed.data.q, { limit: 7, attributesToRetrieve: ["id", "title", "slug", "author", "priceCents"] }); return NextResponse.json({ hits: result.hits }, { headers: { "Cache-Control": "private, max-age=15" } }); } catch (error) { console.error("Catalog search failed", error); return NextResponse.json({ hits: [] }, { status: 503 }); } }
