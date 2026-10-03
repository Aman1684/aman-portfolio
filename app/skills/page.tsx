import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { formatDateRange } from "@/lib/format";
import {
  getEducation,
  getSkills,
  groupSkillsByCategory,
} from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Education & Skills",
  description: "Education history and technical skills",
};

export default async function SkillsPage() {
  const [education, skills] = await Promise.all([
    getEducation().catch(() => []),
    getSkills().catch(() => []),
  ]);
  const skillGroups = groupSkillsByCategory(skills);

  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Background"
            title="Education"
            description="Academic history from Supabase."
          />
          {education.length > 0 ? (
            <Stagger className="space-y-6">
              {education.map((item) => (
                <StaggerItem key={item.id}>
                  <article className="rounded-xl border border-border/70 bg-card/40 p-5 sm:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-heading text-xl font-medium tracking-tight">
                          {item.institution}
                        </h3>
                        <p className="mt-1 text-electric">
                          {[item.degree, item.field_of_study]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDateRange(item.start_date, item.end_date)}
                      </p>
                    </div>
                    {item.grade ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Grade: {item.grade}
                      </p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                        {item.description}
                      </p>
                    ) : null}
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState
              title="No education entries"
              description="Education records will appear here once added."
            />
          )}
        </Container>
      </Section>

      <Section className="border-t border-border/50 bg-surface/40 pt-0">
        <Container>
          <SectionHeader
            eyebrow="Capabilities"
            title="Skills"
            description="Skills grouped by category."
          />
          {skillGroups.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group, index) => (
                <FadeIn key={group.category} delay={index * 0.05}>
                  <div className="rounded-xl border border-border/70 bg-card/40 p-5">
                    <h3 className="font-heading text-lg font-medium">
                      {group.category}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                          {skill.proficiency ? (
                            <span className="text-muted-foreground">
                              · {skill.proficiency}
                            </span>
                          ) : null}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No skills listed"
              description="Add skills in Supabase to populate this section."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
