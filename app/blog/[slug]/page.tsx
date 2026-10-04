import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getPublishedPosts } from "@/src/lib/queries/portfolio";

function getReadingTime(content: string | null) {
  const wordCount = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.ceil(wordCount / 220));
}

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
  const publishedPosts = await getPublishedPosts().catch(() => []);
  const relatedPosts = publishedPosts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      sharedTags: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter((candidate) => candidate.sharedTags > 0)
    .sort((left, right) => right.sharedTags - left.sharedTags)
    .slice(0, 2)
    .map(({ post: relatedPost }) => relatedPost);

  return (
    <Section className="pt-10 sm:pt-14">
      <Container className="max-w-5xl">
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
          <div className="mb-5 flex flex-wrap items-center gap-2">
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
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" aria-hidden="true" />{getReadingTime(post.content)} min read</span>
          </div>
          <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
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
            className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-border/70 bg-surface"
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
            <article className="mt-12 max-w-3xl text-base leading-8 text-muted-foreground text-pretty [&_a]:text-electric [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-electric/60 [&_blockquote]:pl-4 [&_blockquote]:text-foreground/80 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-medium [&_hr]:my-8 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/70 [&_pre]:bg-background [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_strong]:text-foreground [&_table]:my-6 [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </article>
          </FadeIn>
        ) : <p className="mt-10 max-w-3xl text-sm text-muted-foreground">This published entry does not yet have article text.</p>}

        {relatedPosts.length > 0 ? (
          <section aria-labelledby="related-writing" className="mt-16 border-t border-border/70 pt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-electric uppercase">Keep reading</p>
                <h2 id="related-writing" className="mt-2 font-heading text-2xl font-semibold tracking-tight">Related notes</h2>
              </div>
              <Link href="/blog" className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-electric sm:inline-flex">All writing <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group rounded-xl border border-border/70 bg-card/45 p-5 transition-colors hover:border-electric/35">
                  <p className="text-xs text-muted-foreground">{relatedPost.published_at ? formatDate(relatedPost.published_at) : "Published article"}</p>
                  <h3 className="mt-2 font-heading font-medium tracking-tight transition-colors group-hover:text-electric">{relatedPost.title}</h3>
                  {relatedPost.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{relatedPost.excerpt}</p> : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </Section>
  );
}
