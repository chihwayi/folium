"use client";

import { useActionState } from "react";

import { forgotPasswordAction, type ActionState } from "../actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(forgotPasswordAction, {});

  if (state.success) {
    return (
      <div className="space-y-2">
        <h1 className="font-serif text-2xl">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          If an account exists for that address, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-serif text-2xl">Reset your password</h1>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div>
        <label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
