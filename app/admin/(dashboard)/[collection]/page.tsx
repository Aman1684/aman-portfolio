import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { ContentManager } from "@/components/admin/content-manager";
import { adminCollectionConfig, adminCollections } from "@/src/lib/admin/content-config";
import { getAdminRecords } from "@/src/lib/admin/content-queries";

const routeCollections: Record<string, (typeof adminCollections)[number]> = {
  projects: "projects",
  experience: "experiences",
  education: "education",
  skills: "skills",
  research: "research",
  blog: "posts",
  messages: "contact_messages",
  profile: "profiles",
};

export default async function AdminCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: routeName } = await params;
  const collection = routeCollections[routeName];
  if (!collection || !adminCollections.includes(collection)) notFound();

  let records: Record<string, unknown>[] = [];
  let readError = false;
  try {
    records = await getAdminRecords(collection);
  } catch {
    readError = true;
  }

  const config = adminCollectionConfig[collection];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Dashboard
        </Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-electric uppercase">Content management</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{config.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{config.description}</p>
          </div>
          <Link href={collection === "projects" ? "/projects" : collection === "experiences" ? "/experience" : collection === "research" ? "/research" : collection === "posts" ? "/blog" : collection === "profiles" ? "/about" : "/skills"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-electric">
            View public page
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {readError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Records could not be loaded. Verify the Supabase schema and admin read policies before editing content.
        </p>
      ) : (
        <ContentManager
          collection={collection}
          title={config.title}
          fields={config.fields}
          records={records}
        />
      )}
    </div>
  );
}
