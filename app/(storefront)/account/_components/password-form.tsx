"use client";

import { useActionState } from "react";

import { changePasswordAction, type ActionState } from "@/app/(auth)/actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});

  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl">Password</h2>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Password changed.</p>}
      <div>
        <label htmlFor="currentPassword" className="text-xs font-semibold tracking-wide uppercase">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="text-xs font-semibold tracking-wide uppercase">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
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
        className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
