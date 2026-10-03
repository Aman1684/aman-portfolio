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
      <Card className="h-full bg-card/70 transition-colors ring-border/60 group-hover:ring-electric/40">
        {project.cover_image ? (
          <div className="relative aspect-[16/10] overflow-hidden border-b border-border/50">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] border-b border-border/50 bg-gradient-to-br from-electric/15 via-transparent to-transparent" />
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
          <CardTitle className="flex items-start justify-between gap-3 text-lg group-hover:text-electric">
            <span>{project.title}</span>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
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
