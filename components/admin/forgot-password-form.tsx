"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";

import { requestAdminPasswordReset } from "@/app/admin/recovery-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestAdminPasswordReset,
    undefined,
  );

  if (state?.success) {
    return (
      <div className="space-y-5">
        <p
          className="rounded-lg border border-electric/25 bg-electric/10 px-4 py-3 text-sm leading-relaxed text-foreground"
          role="status"
          aria-live="polite"
        >
          If an account matches that address, a password recovery email will be
          sent shortly. Check your inbox and spam folder.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="recovery-email" className="text-sm font-medium">
          Email address
        </label>
        <Input
          id="recovery-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={Boolean(state?.emailError)}
          aria-describedby={state?.emailError ? "recovery-email-error" : undefined}
          className="h-11 bg-background/70 px-3"
        />
        {state?.emailError ? (
          <p
            id="recovery-email-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {state.emailError}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
        {pending ? <Mail className="animate-pulse" aria-hidden="true" /> : <Send aria-hidden="true" />}
        {pending ? "Sending request…" : "Send recovery email"}
      </Button>

      <Link
        href="/admin/login"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to sign in
      </Link>
    </form>
  );
}