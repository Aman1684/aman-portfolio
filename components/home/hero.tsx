import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Download,
  Mail,
  MapPin,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { Profile } from "@/src/lib/queries/portfolio";

export function Hero({ profile }: { profile: Profile | null }) {
  const name = profile?.full_name ?? siteConfig.name;
  const githubUrl = profile?.github_url ?? "https://github.com/Aman1684";

  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-70" />
      <div className="pointer-events-none absolute -top-40 -right-48 size-136 rounded-full bg-electric/7 blur-3xl" />
      <div className="relative mx-auto grid min-h-[min(780px,calc(100svh-4rem))] max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-16 lg:px-8 lg:py-28">
        <div className="relative z-10">
          <FadeIn>
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/70 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Electrical Engineering · IIT Roorkee · Class of 2027
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="max-w-3xl font-heading text-5xl leading-[0.98] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-[5.15rem]">
              {name}
              <span className="text-electric">.</span>
              <span className="mt-5 block text-[0.58em] leading-[1.16] font-medium tracking-[-0.04em] text-muted-foreground">
                Engineer. Researcher. Builder.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.13}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/85 text-pretty sm:text-xl">
              Building things that solve interesting problems.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {profile?.bio ??
                "I work across software engineering, quantitative research, and product building—bringing analytical thinking and hands-on execution to ideas worth exploring."}
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button render={<Link href="/projects" />} size="lg" className="h-11 px-5">
                Explore projects
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button render={<Link href="/about" />} variant="outline" size="lg" className="h-11 px-5">
                About me
              </Button>
              {profile?.resume_url ? (
                <Button
                  render={<a href={profile.resume_url} target="_blank" rel="noopener noreferrer" />}
                  variant="ghost"
                  size="lg"
                  className="h-11 px-4"
                >
                  <Download data-icon="inline-start" />
                  Resume
                </Button>
              ) : null}
            </div>
          </FadeIn>
          <FadeIn delay={0.27}>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
              {profile?.location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-electric" aria-hidden="true" />
                  {profile.location}
                </span>
              ) : null}
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <Mail className="size-4 text-electric" aria-hidden="true" />
                  Get in touch
                </a>
              ) : null}
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                <Code2 className="size-4 text-electric" aria-hidden="true" />
                GitHub
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
              {profile?.linkedin_url ? (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  LinkedIn
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.16} className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-4/5 overflow-hidden rounded-[1.5rem] border border-border/80 bg-[linear-gradient(145deg,rgba(100,140,255,0.12),rgba(17,20,27,0.96)_48%,rgba(23,27,36,0.96))] p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[34px_34px] mask-[linear-gradient(to_bottom,black,transparent_78%)]" />
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 85vw, 360px"
                className="object-cover"
              />
            ) : (
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-border/80 bg-background/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                    Profile / 001
                  </span>
                  <ArrowDownRight className="size-5 text-electric/80" aria-hidden="true" />
                </div>
                <div className="pb-2">
                  <p className="font-mono text-xs tracking-[0.18em] text-electric uppercase">
                    Ideas into systems
                  </p>
                  <p className="mt-3 font-heading text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">
                    AK<span className="text-electric">.</span>
                  </p>
                  <div className="mt-7 h-px w-full bg-linear-to-r from-electric/70 via-border to-transparent" />
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Engineering with curiosity. Building with intent.
                  </p>
                </div>
              </div>
            )}
            {profile?.avatar_url ? (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/90 via-background/45 to-transparent p-6 pt-24">
                <p className="font-mono text-xs tracking-[0.18em] text-electric uppercase">Engineer · Researcher · Builder</p>
                <p className="mt-2 font-heading text-2xl font-semibold tracking-tight text-white">{name}</p>
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground/70 uppercase">
            B.Tech. Electrical Engineering · Expected May 2027
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
