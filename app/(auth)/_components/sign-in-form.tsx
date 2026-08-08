"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction, type ActionState } from "../actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signInAction, {});
  const signUpHref = callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up";

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-serif text-2xl">Sign in</h1>
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div>
        <label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
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
