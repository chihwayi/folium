"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { formatPrice } from "@/lib/catalog/format";

type Hit = { id: string; title: string; slug: string; author: string; priceCents: number };

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      if (response.ok) {
        const data = (await response.json()) as { hits: Hit[] };
        setHits(data.hits); setOpen(true); setActive(-1);
      }
    }, 220);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || hits.length === 0) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, hits.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    if (event.key === "Escape") setOpen(false);
    if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      router.push(`/books/${hits[active].slug}`);
    }
  }

  return (
    <div ref={container} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search" value={query} onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          if (nextQuery.trim().length < 2) {
            setHits([]);
            setOpen(false);
          }
        }} onKeyDown={onKeyDown}
        onFocus={() => hits.length > 0 && setOpen(true)} placeholder="Search title, author, ISBN…"
        role="combobox" aria-label="Search books" aria-expanded={open} aria-controls="search-results" aria-activedescendant={active >= 0 ? `search-hit-${active}` : undefined}
        className="h-10 w-full rounded-full border border-input bg-card pr-4 pl-10 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
      {open && (
        <div id="search-results" role="listbox" className="absolute top-12 right-0 left-0 overflow-hidden rounded-lg border bg-popover shadow-xl">
          {hits.length ? hits.map((hit, index) => (
            <Link key={hit.id} id={`search-hit-${index}`} role="option" aria-selected={active === index}
              href={`/books/${hit.slug}`} onMouseEnter={() => setActive(index)} onClick={() => setOpen(false)}
              className={`block border-b px-4 py-3 last:border-0 ${active === index ? "bg-accent" : "hover:bg-muted"}`}>
              <span className="block font-medium">{hit.title}</span>
              <span className="flex justify-between text-xs text-muted-foreground"><span>{hit.author}</span><span>{formatPrice(hit.priceCents)}</span></span>
            </Link>
          )) : <p className="px-4 py-5 text-sm text-muted-foreground">No matching books found.</p>}
        </div>
      )}
    </div>
  );
}
