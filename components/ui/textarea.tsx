import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground/70",
        "focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/35",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
