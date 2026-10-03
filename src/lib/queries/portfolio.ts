import { createClient } from "@/src/lib/supabase/server";
import type { Tables } from "@/src/types/database.types";

export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;
export type ProjectImage = Tables<"project_images">;
export type Experience = Tables<"experiences">;
export type Education = Tables<"education">;
export type Skill = Tables<"skills">;
export type Research = Tables<"research">;
export type Post = Tables<"posts">;

export async function getProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getFeaturedProjects(limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProjectImages(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getExperiences() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getEducation() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getSkills() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedResearch() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getResearchBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function groupSkillsByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const key = skill.category?.trim() || "Other";
    const existing = groups.get(key) ?? [];
    existing.push(skill);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}
