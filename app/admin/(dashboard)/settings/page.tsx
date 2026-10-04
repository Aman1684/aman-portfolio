import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, HardDrive, KeyRound, Link2 } from "lucide-react";

import { requireAdmin } from "@/src/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Admin settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  await requireAdmin();

  const checks = [
    {
      title: "Recovery signing secret",
      configured: Boolean(process.env.ADMIN_RECOVERY_SECRET),
      description: "Server-only HMAC key for short-lived password-recovery proofs.",
      icon: KeyRound,
    },
    {
      title: "Recovery base URL",
      configured: Boolean(process.env.APP_BASE_URL),
      description: "Server-side application origin used in Supabase recovery email links.",
      icon: Link2,
    },
    {
      title: "Public asset bucket",
      configured: Boolean(process.env.PORTFOLIO_PUBLIC_BUCKET),
      description: "Existing public Supabase Storage bucket used by owner-only uploads.",
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-electric uppercase">System</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Server configuration health. Secret values are never displayed here.</p>
      </div>
      <section className="space-y-3" aria-label="Configuration checks">
        {checks.map((check) => {
          const Icon = check.icon;
          return (
            <article key={check.title} className="flex flex-col gap-4 rounded-xl border border-border/70 bg-surface/55 p-4 sm:flex-row sm:items-center sm:p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-electric"><Icon className="size-4" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-medium">{check.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{check.description}</p>
              </div>
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${check.configured ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>
                {check.configured ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <AlertTriangle className="size-3.5" aria-hidden="true" />}
                {check.configured ? "Configured" : "Needs configuration"}
              </span>
            </article>
          );
        })}
      </section>
      <p className="rounded-xl border border-border/70 bg-background/50 p-4 text-sm leading-relaxed text-muted-foreground">
        Bucket creation, public-read rules, and administrator-only Storage policies must be configured in Supabase after reviewing the existing remote bucket and policies. This settings page does not change remote configuration.
      </p>
    </div>
  );
}
