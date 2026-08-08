import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-serif text-sm tracking-[0.3em] text-muted-foreground uppercase">
        Folium
      </span>
      <h1 className="max-w-xl font-serif text-4xl font-medium text-balance sm:text-5xl">
        An independent bookstore, built for the shelf and the screen.
      </h1>
      <p className="max-w-md text-muted-foreground">
        The catalog isn&apos;t open yet — this is the foundation the rest of
        the store gets built on.
      </p>
      <Button size="lg">Coming soon</Button>
    </main>
  );
}
