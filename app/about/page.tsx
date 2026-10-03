import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download, Code2, Mail, MapPin, Network } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
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

  if (!profile) {
    return (
      <Section>
        <Container>
          <SectionHeader
            eyebrow="About"
            title="Profile"
            description="Profile details are loaded from Supabase."
          />
          <EmptyState
            title="Profile not available"
            description="Add a profile row in Supabase to populate this page."
            actionHref="/contact"
            actionLabel="Contact"
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[240px_1fr]">
          <FadeIn>
            <div className="space-y-4">
              {profile.avatar_url ? (
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                    sizes="240px"
                    priority
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-electric/20 to-transparent text-4xl font-semibold text-electric">
                  {profile.full_name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.location ? (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </Badge>
                ) : null}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="space-y-6">
            <SectionHeader
              className="mb-0"
              eyebrow="About"
              title={profile.full_name}
              description={profile.headline ?? undefined}
            />
            {profile.bio ? (
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground whitespace-pre-wrap text-pretty">
                {profile.bio}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              {profile.resume_url ? (
                <Button
                  render={
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Download data-icon="inline-start" />
                  Download resume
                </Button>
              ) : null}
              {profile.email ? (
                <Button
                  render={<a href={`mailto:${profile.email}`} />}
                  variant="outline"
                >
                  <Mail data-icon="inline-start" />
                  Email
                </Button>
              ) : null}
              {profile.github_url ? (
                <Button
                  render={
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  variant="ghost"
                >
                  <Code2 data-icon="inline-start" />
                  GitHub
                </Button>
              ) : null}
              {profile.linkedin_url ? (
                <Button
                  render={
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  variant="ghost"
                >
                  <Network data-icon="inline-start" />
                  LinkedIn
                </Button>
              ) : null}
              <Button render={<Link href="/skills" />} variant="outline">
                Education & skills
              </Button>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
