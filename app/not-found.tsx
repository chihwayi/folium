import { BookX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center"><BookX className="size-12 text-primary"/><p className="mt-5 text-xs font-semibold tracking-[.2em] text-primary uppercase">Lost between the shelves</p><h1 className="mt-3 font-serif text-5xl">This page has wandered off.</h1><p className="mt-4 max-w-md text-muted-foreground">The title may have moved, or the page may never have been printed.</p><Button asChild className="mt-7"><Link href="/">Return home</Link></Button></main>; }
