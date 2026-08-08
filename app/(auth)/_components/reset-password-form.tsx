"use client";

import { useActionState } from "react";

import { resetPasswordAction, type ActionState } from "../actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(resetPasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-serif text-2xl">Set a new password</h1>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
          New password
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
        {pending ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}
