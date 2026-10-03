import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getPublishedPosts } from "@/src/lib/queries/portfolio";

export async function generateStaticParams() {
  const posts = await getPublishedPosts().catch(() => []);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  return (
    <Section>
      <Container className="max-w-3xl">
        <FadeIn>
          <Button
            render={<Link href="/blog" />}
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
          >
            <ArrowLeft data-icon="inline-start" />
            All posts
          </Button>
          <div className="mb-4 flex flex-wrap gap-2">
            {post.published_at ? (
              <Badge variant="outline">
                {formatDate(post.published_at, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Badge>
            ) : null}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {post.excerpt}
            </p>
          ) : null}
        </FadeIn>

        {post.cover_image ? (
          <FadeIn
            delay={0.08}
            className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-border/70"
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </FadeIn>
        ) : null}

        {post.content ? (
          <FadeIn delay={0.12}>
            <article className="mt-10 whitespace-pre-wrap text-base leading-8 text-muted-foreground text-pretty">
              {post.content}
            </article>
          </FadeIn>
        ) : null}
      </Container>
    </Section>
  );
}
