import type { Metadata } from "next";
import { ArrowUpRight, Blocks } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/projects/project-card";
import { Container, Section } from "@/components/ui/section";
import { getPublishedProjects } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description: "Published portfolio projects",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects().catch(() => []);

  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <div className="mb-12 grid gap-6 border-b border-border/70 pb-10 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-electric uppercase">Selected work</p>
            <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">Things built to solve real problems.</h1>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:justify-self-end">
            A collection of software, engineering, and product work. Each published entry reflects the details available for that project—no invented results or inflated claims.
          </p>
        </div>
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
            title="Project case studies are being prepared"
            description="This page will feature published work and its supporting details as those entries are added."
          />
        )}
        <div className="mt-14 grid gap-4 rounded-2xl border border-border/70 bg-surface/45 p-5 sm:grid-cols-2 sm:p-7">
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-electric">
              <Blocks className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-medium">Built across disciplines</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Software systems, applied engineering, and product experiments share one through-line: thoughtful execution.</p>
            </div>
          </div>
          <a href="https://github.com/Aman1684" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/45 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-electric/30 hover:text-foreground">
            Browse source on GitHub
            <ArrowUpRight className="size-4 text-electric transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </Section>
  );
}
