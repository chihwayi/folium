import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() { return <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"><p className="text-xs tracking-widest text-primary uppercase">Missing from the shelf</p><h1 className="mt-3 font-serif text-4xl">We couldn’t find that book.</h1><p className="mt-4 text-muted-foreground">It may have been moved, renamed, or removed from the collection.</p><Button asChild className="mt-7"><Link href="/books">Browse all books</Link></Button></main>; }
