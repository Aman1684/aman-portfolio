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
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/src/lib/auth/require-admin";
import { getAdminDashboardStats } from "@/src/lib/admin/content-queries";

const modules = [
  { name: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { name: "Experience", icon: BriefcaseBusiness, href: "/admin/experience" },
  { name: "Education", icon: GraduationCap, href: "/admin/education" },
  { name: "Skills", icon: Wrench, href: "/admin/skills" },
  { name: "Research", icon: FlaskConical, href: "/admin/research" },
  { name: "Blog", icon: FileText, href: "/admin/blog" },
  { name: "Messages", icon: Inbox, href: "/admin/messages" },
  { name: "Profile", icon: UserRound, href: "/admin/profile" },
];

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();
  let stats = null;
  try {
    stats = await getAdminDashboardStats();
  } catch {
    // The dashboard remains available while reporting a clear stats failure state.
  }

  const statCards = stats
    ? [
        { label: "Published projects", value: stats.publishedProjects },
        { label: "Draft projects", value: stats.draftProjects },
        { label: "Experience entries", value: stats.experiences },
        { label: "Research entries", value: stats.research },
        { label: "Blog posts", value: stats.posts },
        { label: "Unread messages", value: stats.unreadMessages },
      ]
    : [];

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

      <section aria-labelledby="overview-heading" className="space-y-4">
        <div>
          <h2 id="overview-heading" className="font-heading text-xl font-medium">Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">Live counts from the portfolio database.</p>
        </div>
        {stats ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.label} className="border border-border/70 bg-surface/65 shadow-none">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle></CardHeader>
                <CardContent><p className="font-heading text-3xl font-semibold tracking-tight">{stat.value}</p></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-border/70 bg-surface/45 px-4 py-3 text-sm text-muted-foreground" role="status">Dashboard statistics could not be loaded. Check the database connection and admin RLS policies.</p>
        )}
      </section>

      <section aria-labelledby="modules-heading" className="space-y-4">
        <div>
          <h2 id="modules-heading" className="font-heading text-xl font-medium">
            Portfolio modules
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a section to manage its records. Changes are validated server-side and protected by the admin RLS policies.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ name, icon: Icon, href }) => (
            <Link key={name} href={href} className="group block h-full">
              <Card className="h-full border border-border/70 bg-surface/70 shadow-none transition-colors group-hover:border-electric/35 group-hover:bg-surface">
              <CardHeader className="flex grid-cols-[auto_1fr] items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-electric">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <CardTitle className="text-sm">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">
                  Manage {name.toLowerCase()}
                </span>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}