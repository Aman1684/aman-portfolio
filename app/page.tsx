import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Hero } from "@/components/home/hero";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import {
  getExperiences,
  getFeaturedProjects,
  getProfile,
  getPublishedPosts,
  getPublishedResearch,
} from "@/src/lib/queries/portfolio";

export default async function HomePage() {
  const [profile, featuredProjects, experiences, research, posts] =
    await Promise.all([
      getProfile().catch(() => null),
      getFeaturedProjects(3).catch(() => []),
      getExperiences().catch(() => []),
      getPublishedResearch().catch(() => []),
      getPublishedPosts().catch(() => []),
    ]);

  const latestExperience = experiences[0] ?? null;
  const latestResearch = research[0] ?? null;
  const latestPost = posts[0] ?? null;

  return (
    <>
      <Hero profile={profile} />

      <Section className="border-t border-border/50 pt-0">
        <Container>
          <SectionHeader
            eyebrow="Selected work"
            title="Featured projects"
            description="Published projects from the portfolio database."
          />
          {featuredProjects.length > 0 ? (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState
              title="No featured projects yet"
              description="Projects marked as featured and published will appear here."
              actionHref="/projects"
              actionLabel="Browse projects"
            />
          )}
          <FadeIn className="mt-8">
            <Button render={<Link href="/projects" />} variant="outline">
              All projects
              <ArrowRight data-icon="inline-end" />
            </Button>
          </FadeIn>
        </Container>
      </Section>

      <Section className="border-t border-border/50 bg-surface/40">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <FadeIn>
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-electric uppercase">
                Experience
              </p>
              {latestExperience ? (
                <>
                  <h3 className="font-heading text-xl font-medium">
                    {latestExperience.role}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {latestExperience.company}
                  </p>
                  <Button
                    render={<Link href="/experience" />}
                    variant="link"
                    className="mt-3 px-0"
                  >
                    View timeline
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Experience entries will show here once published.
                </p>
              )}
            </FadeIn>
            <FadeIn delay={0.08}>
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-electric uppercase">
                Research
              </p>
              {latestResearch ? (
                <>
                  <h3 className="font-heading text-xl font-medium">
                    {latestResearch.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {latestResearch.abstract}
                  </p>
                  <Button
                    render={<Link href="/research" />}
                    variant="link"
                    className="mt-3 px-0"
                  >
                    Explore research
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Published research will appear here.
                </p>
              )}
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-electric uppercase">
                Writing
              </p>
              {latestPost ? (
                <>
                  <h3 className="font-heading text-xl font-medium">
                    {latestPost.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {latestPost.excerpt}
                  </p>
                  <Button
                    render={<Link href="/blog" />}
                    variant="link"
                    className="mt-3 px-0"
                  >
                    Read the blog
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Published posts will appear here.
                </p>
              )}
            </FadeIn>
          </div>
        </Container>
      </Section>
    </>
  );
}
