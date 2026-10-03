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
    <Section>
      <Container className="max-w-3xl">
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
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
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

        <div className="mt-12 space-y-10">
          {sections.map((section, index) => (
            <FadeIn key={section.title} delay={0.04 * index}>
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-muted-foreground leading-relaxed text-pretty">
                {section.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
