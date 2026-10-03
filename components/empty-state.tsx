import Link from "next/link";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border/80 bg-card/40 px-6 py-12 text-center",
        className,
      )}
    >
      <h3 className="font-heading text-lg font-medium text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Button render={<Link href={actionHref} />} className="mt-6" size="sm">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
