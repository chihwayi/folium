"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction, type ActionState } from "../actions";

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signInAction, {});
  const signUpHref = callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Welcome back</p>
        <h1 className="mt-1 font-serif text-2xl">Sign in</h1>
      </div>
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      {state.error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
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
          autoComplete="current-password"
          className="mt-1.5"
        />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex justify-between text-xs text-muted-foreground">
        <Link href={signUpHref} className="hover:text-primary">
          Create an account
        </Link>
        <Link href="/forgot-password" className="hover:text-primary">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
