// No real cover art exists yet (nothing's been uploaded to R2), so most
// books render this placeholder. Rather than a flat color block, it's
// styled like an actual designed dust jacket — a deterministic, per-title
// gradient (so a shelf of placeholders still reads as varied, like real
// books), a foil-stamped rule, and typeset title/author — so the catalog
// looks intentional even before real covers exist.
const JACKET_PALETTE = [
  { base: "#1f3a2c", deep: "#0f1e15" }, // forest — matches the site primary
  { base: "#5c2331", deep: "#2e1017" }, // oxblood
  { base: "#1c2c4a", deep: "#0c1424" }, // midnight navy
  { base: "#5a4018", deep: "#2c1e09" }, // tobacco
  { base: "#3b2145", deep: "#1c0f22" }, // plum
  { base: "#2c2721", deep: "#141210" }, // ink charcoal
] as const;

function jacketFor(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return JACKET_PALETTE[hash % JACKET_PALETTE.length];
}

export function BookCover({
  src,
  title,
  author,
  compact = false,
  className = "",
}: {
  src: string | null;
  title: string;
  author?: string;
  compact?: boolean;
  className?: string;
}) {
  const jacket = jacketFor(title);

  return (
    <div
      className={`relative flex aspect-[2/3] @container overflow-hidden rounded-sm shadow-[0_18px_35px_-18px_rgba(0,0,0,.65)] ${className}`}
    >
      {src ? (
        // Cover URLs are stored in the catalog and served by the configured R2 domain.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Cover of ${title}`} className="h-full w-full object-cover" />
      ) : (
        <div
          className="relative flex h-full w-full flex-col text-[#f2e9d8]"
          style={{ background: `linear-gradient(160deg, ${jacket.base} 0%, ${jacket.base} 52%, ${jacket.deep} 100%)` }}
        >
          <div className="grain-overlay absolute opacity-[0.15]" aria-hidden="true" />
          {/* Spine highlight/shadow along the left edge, like a bound book catching light. */}
          <div className="absolute inset-y-0 left-0 w-[3px] bg-white/25" aria-hidden="true" />
          <div className="absolute inset-y-0 left-[3px] w-px bg-black/25" aria-hidden="true" />

          {compact ? (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-xl text-[#f2e9d8]/90" aria-hidden="true">
                {title.charAt(0)}
              </span>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col justify-between p-[9%]">
              <div className="h-px w-full bg-[#c9a35d]/50" aria-hidden="true" />
              <div className="text-center">
                <p className="font-serif text-[clamp(0.95rem,7cqi,1.6rem)] leading-tight font-medium text-balance">
                  {title}
                </p>
                {author && (
                  <p className="mt-3 text-[clamp(0.55rem,3.2cqi,0.75rem)] font-medium tracking-[0.2em] text-[#c9a35d] uppercase">
                    {author}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center gap-2" aria-hidden="true">
                <span className="h-px w-5 bg-[#c9a35d]/50" />
                <span className="size-1 rotate-45 bg-[#c9a35d]/70" />
                <span className="h-px w-5 bg-[#c9a35d]/50" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
