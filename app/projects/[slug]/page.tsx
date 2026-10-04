import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, ExternalLink } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { formatDateRange } from "@/lib/format";
import {
  getProjectBySlug,
  getProjectImages,
  getPublishedProjects,
} from "@/src/lib/queries/portfolio";

export async function generateStaticParams() {
  const projects = await getPublishedProjects().catch(() => []);
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description ?? undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const images = await getProjectImages(project.id).catch(() => []);

  const sections = [
    { title: "Problem", body: project.problem },
    { title: "Approach", body: project.approach },
    { title: "Implementation", body: project.implementation },
    { title: "Results", body: project.results },
    { title: "Learnings", body: project.learnings },
  ].filter((section) => Boolean(section.body));

  return (
    <Section className="pt-12 sm:pt-16">
      <Container className="max-w-5xl">
        <FadeIn>
          <Button
            render={<Link href="/projects" />}
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
          >
            <ArrowLeft data-icon="inline-start" />
            All projects
          </Button>
          <div className="mb-5 flex flex-wrap gap-2">
            {project.featured ? <Badge variant="electric">Featured</Badge> : null}
            {project.category ? (
              <Badge variant="outline">{project.category}</Badge>
            ) : null}
            <Badge variant="secondary">
              {formatDateRange(project.start_date, project.end_date) ??
                "Project"}
            </Badge>
          </div>
          <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {project.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.live_url ? (
              <Button
                render={
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <ExternalLink data-icon="inline-start" />
                Live demo
              </Button>
            ) : null}
            {project.github_url ? (
              <Button
                render={
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="outline"
              >
                <Code2 data-icon="inline-start" />
                Source
              </Button>
            ) : null}
          </div>
        </FadeIn>

        {project.cover_image ? (
          <FadeIn delay={0.08} className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-border/70 bg-surface">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </FadeIn>
        ) : null}

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
          <div className="space-y-10">
            {sections.map((section, index) => (
              <FadeIn key={section.title} delay={0.04 * index}>
                <section aria-labelledby={`project-section-${index}`}>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-electric uppercase">{String(index + 1).padStart(2, "0")}</p>
                  <h2 id={`project-section-${index}`} className="font-heading text-2xl font-medium tracking-tight">
                    {section.title}
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
                    {section.body}
                  </p>
                </section>
              </FadeIn>
            ))}
          </div>
          <aside className="h-fit rounded-xl border border-border/70 bg-surface/55 p-5 lg:sticky lg:top-24">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Project details</p>
            {project.category ? (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="mt-1 text-sm font-medium">{project.category}</p>
              </div>
            ) : null}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Timeline</p>
              <p className="mt-1 text-sm font-medium">{formatDateRange(project.start_date, project.end_date) ?? "Not specified"}</p>
            </div>
            {project.tech_stack.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Built with</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                </div>
              </div>
            ) : null}
            <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-electric">
              More projects
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>

        {images.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-4/3 overflow-hidden rounded-xl border border-border/70"
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text ?? project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
