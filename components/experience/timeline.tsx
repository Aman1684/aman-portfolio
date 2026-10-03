import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/format";
import type { Experience } from "@/src/lib/queries/portfolio";

export function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <Stagger className="relative space-y-0">
      <div className="absolute top-2 bottom-2 left-[7px] w-px bg-border/80 sm:left-[11px]" />
      {experiences.map((item, index) => (
        <StaggerItem key={item.id}>
          <FadeIn delay={index * 0.04} className="relative grid gap-4 pb-10 pl-8 sm:grid-cols-[180px_1fr] sm:gap-8 sm:pl-10">
            <div className="absolute top-1.5 left-0 size-3.5 rounded-full border-2 border-electric bg-background sm:top-2 sm:size-4" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {formatDateRange(item.start_date, item.end_date, item.is_current)}
              </p>
              {item.location ? (
                <p className="text-xs text-muted-foreground/80">{item.location}</p>
              ) : null}
              {item.employment_type ? (
                <Badge variant="outline">{item.employment_type}</Badge>
              ) : null}
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-heading text-xl font-medium tracking-tight">
                  {item.role}
                </h3>
                <p className="text-electric">{item.company}</p>
              </div>
              {item.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  {item.description}
                </p>
              ) : null}
              {item.achievements.length > 0 ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-electric" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </FadeIn>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
