"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const LABELS: Record<number, string> = {
  1: "Not for me",
  2: "It was okay",
  3: "Liked it",
  4: "Really liked it",
  5: "Loved it",
};

export function StarRatingInput({ name = "rating", defaultValue = 5 }: { name?: string; defaultValue?: number }) {
  const [rating, setRating] = useState(defaultValue);
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? rating;

  return (
    <div>
      <input type="hidden" name={name} value={rating} />
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? "" : "s"} — ${LABELS[value]}`}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(null)}
            className="rounded-sm p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                value <= shown ? "fill-accent text-accent" : "fill-transparent text-muted-foreground/50",
              )}
            />
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{LABELS[shown]}</p>
    </div>
  );
}
