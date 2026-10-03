import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/projects/project-card";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { getPublishedProjects } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description: "Published portfolio projects",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects().catch(() => []);

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Work"
          title="Projects"
          description="Published projects fetched from Supabase."
        />
        {projects.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            title="No published projects"
            description="Publish a project in the admin dashboard to list it here."
          />
        )}
      </Container>
    </Section>
  );
}
