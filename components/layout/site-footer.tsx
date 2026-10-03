import Link from "next/link";

import { siteConfig } from "@/lib/site";
import type { Profile } from "@/src/lib/queries/portfolio";

export function SiteFooter({ profile }: { profile: Profile | null }) {
  const name = profile?.full_name ?? siteConfig.name;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="font-heading text-lg font-semibold tracking-tight">
              {name}
              <span className="text-electric">.</span>
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              {profile?.headline ?? siteConfig.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-electric"
              >
                GitHub
              </a>
            ) : null}
            {profile?.linkedin_url ? (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-electric"
              >
                LinkedIn
              </a>
            ) : null}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="transition-colors hover:text-electric"
              >
                Email
              </a>
            ) : null}
            <Link href="/contact" className="transition-colors hover:text-electric">
              Contact
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/80">
          © {year} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
