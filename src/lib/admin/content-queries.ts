import "server-only";

import { getAdminContext } from "@/src/lib/auth/require-admin";
import type { AdminCollection } from "@/src/lib/admin/content-config";

export type AdminRecord = Record<string, unknown>;

export async function getAdminRecords(collection: AdminCollection): Promise<AdminRecord[]> {
  const { supabase } = await getAdminContextOrThrow();

  switch (collection) {
    case "projects": {
      const { data, error } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "experiences": {
      const { data, error } = await supabase.from("experiences").select("*").order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "education": {
      const { data, error } = await supabase.from("education").select("*").order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "skills": {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order").order("name");
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "research": {
      const { data, error } = await supabase.from("research").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "posts": {
      const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "contact_messages": {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
    case "profiles": {
      const { data, error } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row }));
    }
  }
}

export type AdminDashboardStats = {
  publishedProjects: number;
  draftProjects: number;
  experiences: number;
  research: number;
  posts: number;
  unreadMessages: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { supabase } = await getAdminContextOrThrow();
  const [published, drafts, experiences, research, posts, unread] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("research").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread"),
  ]);

  const errors = [published.error, drafts.error, experiences.error, research.error, posts.error, unread.error];
  if (errors.some(Boolean)) throw new Error("Unable to load dashboard statistics.");

  return {
    publishedProjects: published.count ?? 0,
    draftProjects: drafts.count ?? 0,
    experiences: experiences.count ?? 0,
    research: research.count ?? 0,
    posts: posts.count ?? 0,
    unreadMessages: unread.count ?? 0,
  };
}

async function getAdminContextOrThrow() {
  const context = await getAdminContext();
  if (!context) throw new Error("Administrator authorization is required.");
  return context;
}
