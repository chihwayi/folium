import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

// A styled native <select> rather than a full Radix listbox — keeps every
// existing <select>'s server-rendered <option> children working as-is
// (categories, authors, order status, etc. are rendered from server data),
// just re-skinned to match Input/Textarea instead of the browser default.
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "flex h-11 w-full appearance-none rounded-md border border-input bg-card px-3.5 pr-9 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[color,box-shadow,border-color]",
          "focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/35",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export { Select };
