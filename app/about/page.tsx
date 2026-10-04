import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download, Code2, Mail, MapPin, Network } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { siteConfig } from "@/lib/site";
import { getProfile } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}`,
};

export default async function AboutPage() {
  const profile = await getProfile().catch(() => null);
  const name = profile?.full_name ?? siteConfig.name;
  const githubUrl = profile?.github_url ?? "https://github.com/Aman1684";

  return (
    <>
      <Section className="pt-14 sm:pt-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.72fr)] lg:gap-16">
            <FadeIn className="space-y-7">
              <div>
                <p className="mb-3 text-xs font-medium tracking-[0.2em] text-electric uppercase">A little context</p>
                <h1 className="font-heading text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-6xl">Curious about how things work—and how to make them work better.</h1>
              </div>
              <div className="space-y-4 text-base leading-7 text-muted-foreground text-pretty">
                <p>
                  {profile?.bio ??
                    "I’m Aman, an Electrical Engineering undergraduate at IIT Roorkee. I’m interested in the overlap between software engineering, quantitative research, and building products that solve useful problems."}
                </p>
                <p>
                  I enjoy moving between first principles and implementation: understanding a problem carefully, exploring possible approaches, and building something people can actually use.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile?.resume_url ? (
                  <Button render={<a href={profile.resume_url} target="_blank" rel="noopener noreferrer" />}>
                    <Download data-icon="inline-start" />
                    Download resume
                  </Button>
                ) : null}
                {profile?.email ? (
                  <Button render={<a href={`mailto:${profile.email}`} />} variant="outline">
                    <Mail data-icon="inline-start" />
                    Email
                  </Button>
                ) : (
                  <Button render={<Link href="/contact" />} variant="outline">
                    <Mail data-icon="inline-start" />
                    Contact
                  </Button>
                )}
                <Button render={<a href={githubUrl} target="_blank" rel="noopener noreferrer" />} variant="ghost">
                  <Code2 data-icon="inline-start" />
                  GitHub
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
                {profile?.linkedin_url ? (
                  <Button render={<a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" />} variant="ghost">
                    <Network data-icon="inline-start" />
                    LinkedIn
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                ) : null}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-electric/15 via-surface to-background p-5 lg:mx-0 lg:ml-auto">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt={name} fill priority sizes="(max-width: 1024px) 85vw, 360px" className="object-cover" />
                ) : (
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="font-mono text-xs tracking-[0.18em] text-electric uppercase">Engineer · Researcher · Builder</span>
                    <div>
                      <p className="font-heading text-6xl font-semibold tracking-[-0.06em]">AK<span className="text-electric">.</span></p>
                      <p className="mt-3 border-t border-border/70 pt-3 text-sm text-muted-foreground">{profile?.headline ?? "Building things that solve interesting problems."}</p>
                    </div>
                  </div>
                )}
              </div>
              {profile?.location ? (
                <p className="mt-3 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-electric" aria-hidden="true" />
                  {profile.location}
                </p>
              ) : null}
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border/50 bg-surface/35">
        <Container>
          <SectionHeader eyebrow="Education" title="Learning to reason across systems." description="A foundation in electrical engineering, with room to explore software, mathematics, and product design." />
          <article className="grid gap-5 rounded-2xl border border-border/70 bg-background/50 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
            <div>
              <p className="font-heading text-xl font-medium">Indian Institute of Technology Roorkee</p>
              <p className="mt-1 text-sm text-muted-foreground">B.Tech. Electrical Engineering</p>
            </div>
            <Badge variant="outline" className="w-fit">Expected May 2027</Badge>
          </article>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Engineering", "A systems view: how components, constraints, and people interact."],
              ["Research", "Curiosity disciplined by clear assumptions, careful analysis, and evidence."],
              ["Building", "Ownership from the initial question through a considered implementation."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-xl border border-border/70 bg-background/40 p-5">
                <h2 className="font-heading text-base font-medium">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
