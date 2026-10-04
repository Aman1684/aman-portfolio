import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Code2,
  Mail,
  Rocket,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Hero } from "@/components/home/hero";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import {
  getExperiences,
  getFeaturedProjects,
  getProfile,
  getPublishedPosts,
  getPublishedResearch,
  getSkills,
  groupSkillsByCategory,
} from "@/src/lib/queries/portfolio";

export default async function HomePage() {
  const [profile, featuredProjects, experiences, research, posts, skills] =
    await Promise.all([
      getProfile().catch(() => null),
      getFeaturedProjects(3).catch(() => []),
      getExperiences().catch(() => []),
      getPublishedResearch().catch(() => []),
      getPublishedPosts().catch(() => []),
      getSkills().catch(() => []),
    ]);

  const latestExperience = experiences[0] ?? null;
  const latestResearch = research[0] ?? null;
  const latestPost = posts[0] ?? null;
  const skillGroups = groupSkillsByCategory(skills);

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

      <Section className="border-t border-border/50 bg-surface/35">
        <Container>
          <SectionHeader
            eyebrow="How I think"
            title="One toolkit. Different kinds of problems."
            description="I’m drawn to work that rewards both rigorous thinking and the patience to make an idea useful."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Code2,
                number: "01",
                title: "Software & systems",
                body: "Understanding how the pieces fit together, then building software that is clear, reliable, and useful.",
                href: "/projects",
                link: "Selected work",
              },
              {
                icon: ChartNoAxesCombined,
                number: "02",
                title: "Quantitative research",
                body: "Using mathematical and computational thinking to investigate questions, test assumptions, and learn from data.",
                href: "/research",
                link: "Research notes",
              },
              {
                icon: Rocket,
                number: "03",
                title: "Products & entrepreneurship",
                body: "Starting with a real problem and carrying an idea through thoughtful design, implementation, and iteration.",
                href: "/about",
                link: "More about me",
              },
            ].map(({ icon: Icon, number, title, body, href, link }, index) => (
              <FadeIn key={number} delay={index * 0.06}>
                <article className="group flex h-full flex-col rounded-2xl border border-border/70 bg-background/55 p-5 transition-colors hover:border-electric/30 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-surface text-electric">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60">{number}</span>
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-medium tracking-tight">{title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-electric">
                    {link}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {skillGroups.length > 0 ? (
        <Section className="border-t border-border/50">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-2 text-xs font-medium tracking-[0.2em] text-electric uppercase">Tools I use</p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">A growing technical toolkit.</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Skills listed here are maintained from the portfolio database.</p>
                <Button render={<Link href="/skills" />} variant="link" className="mt-3 px-0">
                  All skills and education
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {skillGroups.slice(0, 4).map((group) => (
                  <div key={group.category} className="rounded-xl border border-border/70 bg-card/45 p-4">
                    <h3 className="text-sm font-medium">{group.category}</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {group.items.slice(0, 8).map((skill) => (
                        <Badge key={skill.id} variant="secondary">{skill.name}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="border-t border-border/50 bg-surface/35">
        <Container>
          <SectionHeader
            eyebrow="Around the workbench"
            title="Recent experience, research, and writing."
            description="Only published entries appear here. Nothing is filled in with placeholder achievements."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <PreviewCard
              label="Experience"
              title={latestExperience ? latestExperience.role : "Career timeline"}
              detail={latestExperience ? latestExperience.company : "Verified roles and the work behind them."}
              href="/experience"
              empty={!latestExperience}
            />
            <PreviewCard
              label="Research"
              title={latestResearch?.title ?? "Questions worth testing"}
              detail={latestResearch?.abstract ?? "Explorations in quantitative research, mathematics, and computation."}
              href="/research"
              empty={!latestResearch}
            />
            <PreviewCard
              label="Writing"
              title={latestPost?.title ?? "Notes from building"}
              detail={latestPost?.excerpt ?? "Technical writing and ideas in progress."}
              href="/blog"
              empty={!latestPost}
            />
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border/50">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface/70 px-6 py-8 sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-electric/8 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-medium tracking-[0.2em] text-electric uppercase">Have a good problem?</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance">Let’s make something matter.</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">I’m always glad to connect with people building thoughtful products, exploring hard questions, or improving useful systems.</p>
              </div>
              <Button render={<Link href="/contact" />} size="lg" className="h-11 shrink-0 px-5">
                Get in touch
                <Mail data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function PreviewCard({
  label,
  title,
  detail,
  href,
  empty,
}: {
  label: string;
  title: string;
  detail: string;
  href: string;
  empty: boolean;
}) {
  return (
    <Link href={href} className="group block h-full rounded-xl border border-border/70 bg-card/45 p-5 transition-colors hover:border-electric/30 hover:bg-card/70">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-[0.16em] text-electric uppercase">{label}</p>
        <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-electric" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-heading text-lg font-medium tracking-tight">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      <p className="mt-5 text-xs text-muted-foreground/70">{empty ? "Explore section" : "Read more"}</p>
    </Link>
  );
}
