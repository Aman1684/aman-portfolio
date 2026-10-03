import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import { getRecoveryAdminContext } from "@/src/lib/auth/recovery-session";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/admin/reset-password">) {
  const [{ error }, recoveryContext] = await Promise.all([
    searchParams,
    getRecoveryAdminContext(),
  ]);
  const isRecoverySessionValid = recoveryContext !== null && error !== "expired";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-50" />
      <div className="relative w-full max-w-md">
        <Link
          href="/admin/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to sign in
        </Link>

        <div className="rounded-2xl border border-border/70 bg-surface/90 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7 flex size-12 items-center justify-center rounded-xl border border-electric/25 bg-electric/10 text-electric">
            {isRecoverySessionValid ? (
              <KeyRound className="size-5" aria-hidden="true" />
            ) : (
              <ShieldCheck className="size-5" aria-hidden="true" />
            )}
          </div>
          {isRecoverySessionValid ? (
            <>
              <p className="text-xs font-medium tracking-[0.2em] text-electric uppercase">
                Account recovery
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
                Choose a new password
              </h1>
              <p className="mt-2 mb-7 text-sm leading-relaxed text-muted-foreground">
                Use at least 12 characters. You’ll be asked to sign in again
                after the password is updated.
              </p>
              <ResetPasswordForm />
            </>
          ) : (
            <>
              <p className="text-xs font-medium tracking-[0.2em] text-electric uppercase">
                Recovery link unavailable
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
                Link expired or invalid
              </h1>
              <p className="mt-2 mb-7 text-sm leading-relaxed text-muted-foreground">
                This password recovery link is no longer valid. Request a new
                link and open it in the same browser.
              </p>
              <Link
                href="/admin/forgot-password"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Request a new recovery email
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}