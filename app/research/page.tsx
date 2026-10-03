import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { getPublishedResearch } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Research",
  description: "Quantitative research and findings",
};

export default async function ResearchPage() {
  const research = await getPublishedResearch().catch(() => []);

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Inquiry"
          title="Quantitative research"
          description="Published research entries from Supabase."
        />
        {research.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {research.map((item) => (
              <StaggerItem key={item.id}>
                <Link href={`/research/${item.slug}`} className="group block h-full">
                  <Card className="h-full bg-card/70 transition-colors ring-border/60 group-hover:ring-electric/40">
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {item.category ? (
                          <Badge variant="outline">{item.category}</Badge>
                        ) : null}
                      </div>
                      <CardTitle className="flex items-start justify-between gap-3 text-lg group-hover:text-electric">
                        <span>{item.title}</span>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
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
            title="No published research"
            description="Publish research entries to list them here."
          />
        )}
      </Container>
    </Section>
  );
}
