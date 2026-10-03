import Link from "next/link";
import { ArrowUpRight, LogOut, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { logoutAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/src/lib/auth/require-admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-surface/80">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-electric/25 bg-electric/10 text-electric">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-sm font-semibold">
                Aman Kumar
              </span>
              <span className="block text-xs text-muted-foreground">
                Portfolio admin
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-56 truncate text-sm text-muted-foreground sm:block">
              {user.email ?? "Authorized administrator"}
            </span>
            <form action={logoutAdmin}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut data-icon="inline-start" aria-hidden="true" />
                Sign out
              </Button>
            </form>
            <Link
              href="/"
              className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              View site
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}