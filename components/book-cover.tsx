import { BookOpen } from "lucide-react";

export function BookCover({ src, title, className = "" }: { src: string | null; title: string; className?: string }) {
  return (
    <div className={`relative flex aspect-[2/3] overflow-hidden rounded-sm bg-primary text-primary-foreground shadow-[0_18px_35px_-18px_rgba(0,0,0,.65)] ${className}`}>
      {src ? (
        // Cover URLs are stored in the catalog and served by the configured R2 domain.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Cover of ${title}`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-primary to-primary/75 p-5 text-center">
          <BookOpen className="size-8 opacity-70" aria-hidden="true" />
          <span className="font-serif text-lg leading-tight">{title}</span>
        </div>
      )}
    </div>
  );
}
