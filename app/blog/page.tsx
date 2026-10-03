import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
import { formatDate } from "@/lib/format";
import { getPublishedPosts } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing and notes",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts().catch(() => []);

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Writing"
          title="Technical blog"
          description="Published posts from Supabase."
        />
        {posts.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden bg-card/70 transition-colors ring-border/60 group-hover:ring-electric/40">
                    {post.cover_image ? (
                      <div className="relative aspect-[16/9] border-b border-border/50">
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
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
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
            title="No published posts"
            description="Publish a blog post to show it here."
          />
        )}
      </Container>
    </Section>
  );
}
