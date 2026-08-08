import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-input bg-card px-3.5 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground/70",
        "focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/35",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
