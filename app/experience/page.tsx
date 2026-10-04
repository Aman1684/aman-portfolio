import type { Metadata } from "next";

import { ExperienceTimeline } from "@/components/experience/timeline";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { getExperiences } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience timeline",
};

export default async function ExperiencePage() {
  const experiences = await getExperiences().catch(() => []);
  const verifiedBackground = [
    { company: "Deutsche Bank", kind: "Internship", dates: "May – July 2026" },
    { company: "Aerial Systems", kind: "Internship", dates: "January – May 2025" },
  ];

  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <SectionHeader
          eyebrow="Career"
          title="Experience, earned over time."
          description="A record of professional experiences. Entries from the portfolio database are shown first; where detail has not yet been added, only the verified organization and dates are listed."
        />
        {experiences.length > 0 ? (
          <ExperienceTimeline experiences={experiences} />
        ) : (
          <ol className="relative ml-1 border-l border-border/80 pl-6 sm:ml-2 sm:pl-9">
            {verifiedBackground.map((item) => (
              <li key={item.company} className="relative pb-10 last:pb-0">
                <span className="absolute top-1.5 -left-7.5 size-3 rounded-full border-2 border-electric bg-background sm:-left-10.5" aria-hidden="true" />
                <article className="grid gap-3 rounded-xl border border-border/70 bg-card/45 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:p-6">
                  <div>
                    <p className="text-xs font-medium tracking-[0.16em] text-electric uppercase">{item.kind}</p>
                    <h2 className="mt-2 font-heading text-xl font-medium tracking-tight">{item.company}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Additional role details will be added when verified information is available.</p>
                  </div>
                  <p className="text-sm text-muted-foreground sm:text-right">{item.dates}</p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </Section>
  );
}
