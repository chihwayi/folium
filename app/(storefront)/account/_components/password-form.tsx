"use client";

import { useActionState } from "react";

import { changePasswordAction, type ActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});

  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-serif text-xl">Password</h2>
      {state.error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-primary">Password changed.</p>}
      <div>
        <label htmlFor="currentPassword" className="text-xs font-semibold tracking-wide uppercase">
          Current password
        </label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="text-xs font-semibold tracking-wide uppercase">
          New password
        </label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1.5"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
}
