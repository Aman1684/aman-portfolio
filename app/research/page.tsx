import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FlaskConical } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { getPublishedResearch } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Research",
  description: "Quantitative research and findings",
};

export default async function ResearchPage() {
  const research = await getPublishedResearch().catch(() => []);

  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <div className="mb-12 grid gap-6 border-b border-border/70 pb-10 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-electric uppercase">Inquiry / 02</p>
            <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">Research starts with a better question.</h1>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:justify-self-end">
            A home for published investigations and carefully described work. Ongoing experiments will be labeled as such when that status is available; they are never presented as completed findings.
          </p>
        </div>
        {research.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {research.map((item) => (
              <StaggerItem key={item.id}>
                <Link href={`/research/${item.slug}`} className="group block h-full">
                  <Card className="h-full border border-border/70 bg-card/55 shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:border-electric/35 group-hover:bg-card/80">
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-background text-electric"><FlaskConical className="size-4" aria-hidden="true" /></span>
                        {item.category ? (
                          <Badge variant="outline">{item.category}</Badge>
                        ) : null}
                      </div>
                      <CardTitle className="flex items-start justify-between gap-3 text-lg group-hover:text-electric">
                        <span>{item.title}</span>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-electric opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
                      </CardTitle>
                      {item.abstract ? (
                        <CardDescription className="line-clamp-4">
                          {item.abstract}
                        </CardDescription>
                      ) : null}
                    </CardHeader>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            title="Research notes are taking shape"
            description="Published entries will appear here when there is a complete, verified account to share."
          />
        )}
        <p className="mt-6 border-t border-border/50 pt-4 text-xs leading-relaxed text-muted-foreground/75">Entries are published only when their status is marked published in the portfolio data.</p>
      </Container>
    </Section>
  );
}
