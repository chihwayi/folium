"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpAction, type ActionState } from "../actions";

export function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signUpAction, {});
  const signInHref = callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Join Folium</p>
        <h1 className="mt-1 font-serif text-2xl">Create an account</h1>
      </div>
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      {state.error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="text-xs font-semibold tracking-wide uppercase">
          Name
        </label>
        <Input id="name" name="name" type="text" required autoComplete="name" className="mt-1.5" />
      </div>
      <div>
        <label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase">
          Email
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1.5" />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1.5"
        />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href={signInHref} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
