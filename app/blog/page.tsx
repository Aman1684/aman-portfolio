import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpenText } from "lucide-react";

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
import { formatDate } from "@/lib/format";
import { getPublishedPosts } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing and notes",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts().catch(() => []);

  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <div className="mb-12 grid gap-6 border-b border-border/70 pb-10 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-electric uppercase">Field notes / 03</p>
            <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">Ideas are better when they’re shared.</h1>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:justify-self-end">
            Writing on software, systems, and the questions that come up while building. Only published posts from the portfolio database appear here.
          </p>
        </div>
        {posts.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden border border-border/70 bg-card/55 shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:border-electric/35 group-hover:bg-card/80">
                    {post.cover_image ? (
                      <div className="relative aspect-video border-b border-border/50 bg-surface">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : null}
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-background text-electric"><BookOpenText className="size-4" aria-hidden="true" /></span>
                        {post.published_at ? (
                          <Badge variant="outline">
                            {formatDate(post.published_at, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Badge>
                        ) : null}
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="flex items-start justify-between gap-3 text-lg group-hover:text-electric">
                        <span>{post.title}</span>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-electric opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
                      </CardTitle>
                      {post.excerpt ? (
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
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
            title="The notebook is open"
            description="Published articles will appear here as they are ready to share."
          />
        )}
      </Container>
    </Section>
  );
}
