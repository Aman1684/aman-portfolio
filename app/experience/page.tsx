import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { ExperienceTimeline } from "@/components/experience/timeline";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { getExperiences } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience timeline",
};

export default async function ExperiencePage() {
  const experiences = await getExperiences().catch(() => []);

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Career"
          title="Experience"
          description="Roles and work history from Supabase."
        />
        {experiences.length > 0 ? (
          <ExperienceTimeline experiences={experiences} />
        ) : (
          <EmptyState
            title="No experience entries"
            description="Add experience records in the database to build this timeline."
          />
        )}
      </Container>
    </Section>
  );
}
