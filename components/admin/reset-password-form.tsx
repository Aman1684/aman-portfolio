"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Check, KeyRound, LoaderCircle } from "lucide-react";

import { updateAdminPassword } from "@/app/admin/recovery-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updateAdminPassword,
    undefined,
  );

  if (state?.success) {
    return (
      <div className="space-y-5">
        <p
          className="flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed text-foreground"
          role="status"
          aria-live="polite"
        >
          <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
          Your password has been updated. Sign in with your new password to
          continue.
        </p>
        <Button render={<Link href="/admin/login" />} className="w-full">
          Go to admin sign in
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium">
          New password
        </label>
        <Input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          aria-invalid={Boolean(state?.passwordError)}
          aria-describedby={state?.passwordError ? "new-password-error" : undefined}
          className="h-11 bg-background/70 px-3"
        />
        {state?.passwordError ? (
          <p id="new-password-error" className="text-sm text-destructive" role="alert">
            {state.passwordError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm new password
        </label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={1}
          maxLength={128}
          required
          aria-invalid={Boolean(state?.confirmPasswordError)}
          aria-describedby={
            state?.confirmPasswordError ? "confirm-password-error" : undefined
          }
          className="h-11 bg-background/70 px-3"
        />
        {state?.confirmPasswordError ? (
          <p
            id="confirm-password-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {state.confirmPasswordError}
          </p>
        ) : null}
      </div>

      {state?.error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {state.error}{" "}
          {state.error.includes("expired") ? (
            <Link className="underline underline-offset-4" href="/admin/forgot-password">
              Request another recovery email.
            </Link>
          ) : null}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
        {pending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <KeyRound aria-hidden="true" />
        )}
        {pending ? "Updating password…" : "Update password"}
      </Button>
    </form>
  );
}