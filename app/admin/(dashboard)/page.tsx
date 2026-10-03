import {
  BriefcaseBusiness,
  FileText,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Inbox,
  UserRound,
  Wrench,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/src/lib/auth/require-admin";

const modules = [
  { name: "Projects", icon: FolderKanban },
  { name: "Experience", icon: BriefcaseBusiness },
  { name: "Education", icon: GraduationCap },
  { name: "Skills", icon: Wrench },
  { name: "Research", icon: FlaskConical },
  { name: "Blog", icon: FileText },
  { name: "Messages", icon: Inbox },
  { name: "Profile", icon: UserRound },
];

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs font-medium tracking-[0.2em] text-electric uppercase">
          Workspace
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">
            {user.email ?? "authorized administrator"}
          </span>
          .
        </p>
      </section>

      <section aria-labelledby="modules-heading" className="space-y-4">
        <div>
          <h2 id="modules-heading" className="font-heading text-xl font-medium">
            Portfolio modules
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Content management tools will be added in the next development phases.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ name, icon: Icon }) => (
            <Card
              key={name}
              className="border border-border/70 bg-surface/70 shadow-none"
            >
              <CardHeader className="flex grid-cols-[auto_1fr] items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-electric">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <CardTitle className="text-sm">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">
                  Coming in a subsequent phase
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}