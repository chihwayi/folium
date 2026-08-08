import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Pagination({ page, pages, searchParams }: { page: number; pages: number; searchParams: Record<string, string | string[] | undefined> }) {
  if (pages <= 1) return null;
  const href = (nextPage: number) => { const params = new URLSearchParams(); Object.entries(searchParams).forEach(([key, value]) => { if (key !== "page" && typeof value === "string") params.set(key, value); }); params.set("page", String(nextPage)); return `?${params}`; };
  return <nav aria-label="Catalog pages" className="mt-12 flex items-center justify-center gap-4"><Link aria-disabled={page <= 1} className={`flex items-center gap-1 text-sm ${page <= 1 ? "pointer-events-none opacity-40" : "text-primary"}`} href={href(page - 1)}><ChevronLeft className="size-4" /> Previous</Link><span className="text-sm text-muted-foreground">Page {page} of {pages}</span><Link aria-disabled={page >= pages} className={`flex items-center gap-1 text-sm ${page >= pages ? "pointer-events-none opacity-40" : "text-primary"}`} href={href(page + 1)}>Next <ChevronRight className="size-4" /></Link></nav>;
}
