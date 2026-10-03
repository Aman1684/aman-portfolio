import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
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
            <Mail className="size-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-medium tracking-[0.2em] text-electric uppercase">
            Account recovery
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            Forgot password?
          </h1>
          <p className="mt-2 mb-7 text-sm leading-relaxed text-muted-foreground">
            Enter the email address for your authorized admin account. If it
            matches, we’ll send a secure recovery link.
          </p>
          <ForgotPasswordForm />
          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Recovery is limited to an authorized administrator.
          </p>
        </div>
      </div>
    </div>
  );
}