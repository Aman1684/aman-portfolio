import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import {
  getPublishedResearch,
  getResearchBySlug,
} from "@/src/lib/queries/portfolio";

export async function generateStaticParams() {
  const research = await getPublishedResearch().catch(() => []);
  return research.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getResearchBySlug(slug).catch(() => null);
  if (!item) return { title: "Research" };
  return {
    title: item.title,
    description: item.abstract ?? undefined,
  };
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getResearchBySlug(slug).catch(() => null);
  if (!item) notFound();

  const sections = [
    { title: "Abstract", body: item.abstract },
    { title: "Methodology", body: item.methodology },
    { title: "Findings", body: item.findings },
  ].filter((section) => Boolean(section.body));

  return (
    <Section className="pt-10 sm:pt-14">
      <Container className="max-w-5xl">
        <FadeIn>
          <Button
            render={<Link href="/research" />}
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
          >
            <ArrowLeft data-icon="inline-start" />
            All research
          </Button>
          {item.category ? (
            <Badge variant="outline" className="mb-4">
              {item.category}
            </Badge>
          ) : null}
          <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            {item.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            {item.paper_url ? (
              <Button
                render={
                  <a
                    href={item.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <ExternalLink data-icon="inline-start" />
                Paper
              </Button>
            ) : null}
            {item.github_url ? (
              <Button
                render={
                  <a
                    href={item.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="outline"
              >
                <Code2 data-icon="inline-start" />
                Code
              </Button>
            ) : null}
            {item.dataset_url ? (
              <Button
                render={
                  <a
                    href={item.dataset_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="ghost"
              >
                Dataset
              </Button>
            ) : null}
          </div>
        </FadeIn>

        {item.technologies.length > 0 ? (
          <FadeIn delay={0.08} className="mt-8 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </FadeIn>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
          <div className="space-y-10">
            {sections.map((section, index) => (
              <FadeIn key={section.title} delay={0.04 * index}>
                <section aria-labelledby={`research-section-${index}`}>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-electric uppercase">{String(index + 1).padStart(2, "0")}</p>
                  <h2 id={`research-section-${index}`} className="font-heading text-2xl font-medium tracking-tight">
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
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Research details</p>
            {item.category ? <div className="mt-4"><p className="text-xs text-muted-foreground">Topic</p><p className="mt-1 text-sm font-medium">{item.category}</p></div> : null}
            {item.technologies.length > 0 ? (
              <div className="mt-4"><p className="text-xs text-muted-foreground">Methods / tools</p><div className="mt-2 flex flex-wrap gap-1.5">{item.technologies.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}</div></div>
            ) : null}
            <Link href="/research" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-electric">All research</Link>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
