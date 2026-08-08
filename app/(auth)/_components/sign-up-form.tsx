"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpAction, type ActionState } from "../actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signUpAction, {});
  const signInHref = callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in";

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-serif text-2xl">Create an account</h1>
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div>
        <label htmlFor="name" className="text-xs font-semibold tracking-wide uppercase">
          Name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
      </div>
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
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href={signInHref} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
