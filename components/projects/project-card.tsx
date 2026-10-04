import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/src/lib/queries/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <Card className="h-full border border-border/70 bg-card/65 shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:border-electric/35 group-hover:bg-card/90">
        {project.cover_image ? (
          <div className="relative aspect-16/10 overflow-hidden border-b border-border/50 bg-surface">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative flex aspect-16/10 items-end overflow-hidden border-b border-border/50 bg-linear-to-br from-electric/15 via-surface to-background p-5">
            <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size-[32px_32px] mask-[linear-gradient(to_bottom,black,transparent)]" />
            <span className="relative font-mono text-[10px] tracking-[0.18em] text-foreground/55 uppercase">Project / Case study</span>
          </div>
        )}
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {project.featured ? (
              <Badge variant="electric">Featured</Badge>
            ) : null}
            {project.category ? (
              <Badge variant="outline">{project.category}</Badge>
            ) : null}
          </div>
          <CardTitle className="flex items-start justify-between gap-3 text-lg transition-colors group-hover:text-electric">
            <span>{project.title}</span>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-electric opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
          </CardTitle>
          {project.description ? (
            <CardDescription className="line-clamp-3">
              {project.description}
            </CardDescription>
          ) : null}
        </CardHeader>
        {project.tech_stack.length > 0 ? (
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
