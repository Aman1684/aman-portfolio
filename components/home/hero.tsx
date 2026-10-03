import Link from "next/link";
import { ArrowRight, Download, Code2, Mail, MapPin, Network } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import type { Profile } from "@/src/lib/queries/portfolio";

export function Hero({ profile }: { profile: Profile | null }) {
  const name = profile?.full_name ?? siteConfig.name;
  const headline = profile?.headline ?? "Software engineer";
  const bio =
    profile?.bio ??
    "Building reliable software. Published work will appear here once added.";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 surface-grid" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="mb-4 text-xs font-medium tracking-[0.22em] text-electric uppercase">
            Portfolio
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h1 className="font-heading max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {name}
            <span className="text-electric">.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-5 max-w-2xl text-xl text-muted-foreground text-pretty sm:text-2xl">
            {headline}
          </p>
        </FadeIn>
        <FadeIn delay={0.24}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground/90 text-pretty">
            {bio}
          </p>
        </FadeIn>
        <FadeIn delay={0.32}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button render={<Link href="/projects" />} size="lg">
              View projects
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href="/contact" />}
              variant="outline"
              size="lg"
            >
              Contact
            </Button>
            {profile?.resume_url ? (
              <Button
                render={
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="ghost"
                size="lg"
              >
                <Download data-icon="inline-start" />
                Resume
              </Button>
            ) : null}
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {profile?.location ? (
              <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                <MapPin className="size-3.5" />
                {profile.location}
              </Badge>
            ) : null}
            {profile?.email ? (
              <a href={`mailto:${profile.email}`}>
                <Badge variant="electric" className="gap-1.5 px-2.5 py-1">
                  <Mail className="size-3.5" />
                  {profile.email}
                </Badge>
              </a>
            ) : null}
            {profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                  <Code2 className="size-3.5" />
                  GitHub
                </Badge>
              </a>
            ) : null}
            {profile?.linkedin_url ? (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                  <Network className="size-3.5" />
                  LinkedIn
                </Badge>
              </a>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
