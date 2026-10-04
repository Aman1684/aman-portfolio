"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/src/lib/auth/require-admin";
import type { AdminCollection } from "@/src/lib/admin/content-config";

const optionalText = z.preprocess(
  (value) => value ?? "",
  z.string().trim().max(20000).transform((value) => value || null),
);
const optionalDate = z.string().trim().transform((value) => value || null).pipe(z.string().date().nullable());
const urlOrNull = z.preprocess(
  (value) => value ?? "",
  z.string().trim().max(2048).transform((value) => value || null).pipe(z.string().url().nullable()),
);
const textList = z.string().max(10000).transform((value) => value.split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean).slice(0, 100));
const slug = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const status = z.enum(["draft", "published"]);

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200), slug, description: optionalText,
  category: optionalText, tech_stack: textList, cover_image: urlOrNull,
  github_url: urlOrNull, live_url: urlOrNull, problem: optionalText,
  approach: optionalText, implementation: optionalText, results: optionalText,
  learnings: optionalText, start_date: optionalDate, end_date: optionalDate,
  featured: z.boolean(), status,
});
const experienceSchema = z.object({
  company: z.string().trim().min(1).max(200), role: z.string().trim().min(1).max(200),
  employment_type: optionalText, location: optionalText, description: optionalText,
  achievements: textList, technologies: textList, start_date: optionalDate,
  end_date: optionalDate, is_current: z.boolean(),
});
const educationSchema = z.object({
  institution: z.string().trim().min(1).max(250), degree: optionalText,
  field_of_study: optionalText, grade: optionalText, description: optionalText,
  start_date: optionalDate, end_date: optionalDate,
});
const skillSchema = z.object({
  name: z.string().trim().min(1).max(120), category: optionalText,
  proficiency: optionalText, sort_order: z.number().int().min(-10000).max(10000),
});
const researchSchema = z.object({
  title: z.string().trim().min(1).max(250), slug, abstract: optionalText,
  methodology: optionalText, findings: optionalText, category: optionalText,
  technologies: textList, paper_url: urlOrNull, github_url: urlOrNull,
  dataset_url: urlOrNull, status,
});
const postSchema = z.object({
  title: z.string().trim().min(1).max(250), slug, excerpt: optionalText,
  content: z.string().max(100000).transform((value) => value || null),
  cover_image: urlOrNull, tags: textList, status,
  published_at: optionalDate,
});
const messageSchema = z.object({
  name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(200),
  subject: optionalText, message: z.string().trim().min(1).max(5000),
  status: z.enum(["unread", "read", "replied", "archived"]),
});
const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(160), headline: optionalText,
  bio: optionalText, location: optionalText,
  email: z.preprocess(
    (value) => value ?? "",
    z.string().trim().email().max(200).or(z.literal("")).transform((value) => value || null),
  ),
  github_url: urlOrNull, linkedin_url: urlOrNull, website_url: urlOrNull,
  avatar_url: urlOrNull, resume_url: urlOrNull,
});

const idSchema = z.string().uuid();
const collectionSchema = z.enum([
  "projects", "experiences", "education", "skills", "research", "posts",
  "contact_messages", "profiles",
]);

function formValues(formData: FormData) {
  const fields = [
    "title", "slug", "description", "category", "tech_stack", "cover_image", "github_url", "live_url",
    "problem", "approach", "implementation", "results", "learnings", "start_date", "end_date", "featured", "status",
    "company", "role", "employment_type", "location", "achievements", "technologies", "is_current",
    "institution", "degree", "field_of_study", "grade", "name", "proficiency", "sort_order",
    "abstract", "methodology", "findings", "paper_url", "dataset_url", "excerpt", "content", "tags", "published_at",
    "email", "subject", "message", "full_name", "headline", "bio", "linkedin_url", "website_url", "avatar_url", "resume_url",
  ];
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    if (field === "featured" || field === "is_current") {
      values[field] = formData.get(field) === "on";
    } else if (field === "sort_order") {
      const raw = formData.get(field);
      values[field] = raw === null || raw === "" ? 0 : Number(raw);
    } else {
      values[field] = formData.get(field)?.toString() ?? "";
    }
  }
  return values;
}

export type ContentActionState = { error?: string; success?: boolean; recordId?: string } | undefined;

function logContentFailure(collection: AdminCollection, code?: string, status?: number) {
  console.error("[admin-content] save failed", {
    collection,
    code: code && /^[a-z0-9_-]{1,32}$/i.test(code) ? code : undefined,
    status: typeof status === "number" && Number.isInteger(status) && status >= 100 && status <= 599 ? status : undefined,
  });
}

export async function mutateAdminContent(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const auth = await getAdminContext();
  if (!auth) return { error: "Your administrator session is no longer valid. Sign in again." };

  const collection = collectionSchema.safeParse(formData.get("collection"));
  const operation = z.enum(["save", "delete"]).safeParse(formData.get("operation"));
  if (!collection.success || !operation.success) return { error: "Invalid content operation." };

  const idRaw = formData.get("id");
  const id = idRaw ? idSchema.safeParse(idRaw) : null;
  if (idRaw && !id?.success) return { error: "Invalid record identifier." };

  if (operation.data === "delete") {
    if (!id?.success) return { error: "Select a record before deleting it." };
    if (collection.data === "profiles") {
      return { error: "The portfolio profile cannot be deleted. Edit its details instead." };
    }
    const deleted = await deleteRecord(auth.supabase, collection.data, id.data);
    if (!deleted) return { error: "Unable to delete this record." };
  } else {
    const values = formValues(formData);
    const saved = await saveRecord(auth.supabase, collection.data, values, id?.success ? id.data : null);
    if (!saved.ok) return { error: saved.message ?? "Unable to save this record. Check required fields and unique slugs." };
    revalidatePath("/admin/profile");
    revalidatePath("/about");
    revalidatePath("/");
    return { success: true, recordId: saved.recordId };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${collection.data}`);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/experience");
  revalidatePath("/skills");
  revalidatePath("/research");
  revalidatePath("/blog");
  revalidatePath("/contact");
  return { success: true };
}

async function saveRecord(
  supabase: Awaited<ReturnType<typeof getAdminContext>> extends infer C ? NonNullable<C> extends { supabase: infer S } ? S : never : never,
  collection: AdminCollection,
  rawValues: Record<string, unknown>,
  id: string | null,
): Promise<{ ok: true; recordId?: string } | { ok: false; message?: string }> {
  try {
    switch (collection) {
      case "projects": {
        const result = projectSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        if (id) {
          const { error } = await supabase.from("projects").update(result.data).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const { data, error } = await supabase.from("projects").insert(result.data).select("id").single();
        return error ? databaseFailure(collection, error) : { ok: true, recordId: data.id };
      }
      case "experiences": {
        const result = experienceSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        if (id) {
          const { error } = await supabase.from("experiences").update(result.data).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const { data, error } = await supabase.from("experiences").insert(result.data).select("id").single();
        return error ? databaseFailure(collection, error) : { ok: true, recordId: data.id };
      }
      case "education": {
        const result = educationSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        if (id) {
          const { error } = await supabase.from("education").update(result.data).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const { data, error } = await supabase.from("education").insert(result.data).select("id").single();
        return error ? databaseFailure(collection, error) : { ok: true, recordId: data.id };
      }
      case "skills": {
        const result = skillSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        if (id) {
          const { error } = await supabase.from("skills").update(result.data).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const { data, error } = await supabase.from("skills").insert(result.data).select("id").single();
        return error ? databaseFailure(collection, error) : { ok: true, recordId: data.id };
      }
      case "research": {
        const result = researchSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        if (id) {
          const { error } = await supabase.from("research").update(result.data).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const { data, error } = await supabase.from("research").insert(result.data).select("id").single();
        return error ? databaseFailure(collection, error) : { ok: true, recordId: data.id };
      }
      case "posts": {
        const result = postSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        const postData = {
          ...result.data,
          published_at: result.data.status === "published"
            ? result.data.published_at ?? new Date().toISOString().slice(0, 10)
            : result.data.published_at,
        };
        if (id) {
          const { error } = await supabase.from("posts").update(postData).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const { data, error } = await supabase.from("posts").insert(postData).select("id").single();
        return error ? databaseFailure(collection, error) : { ok: true, recordId: data.id };
      }
      case "contact_messages": {
        if (!id) return { ok: false, message: "Select a message before updating its status." };
        const result = messageSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        const { error } = await supabase.from("contact_messages").update({ status: result.data.status }).eq("id", id);
        return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
      }
      case "profiles": {
        const result = profileSchema.safeParse(rawValues);
        if (!result.success) return { ok: false, message: validationMessage(result.error) };
        const profileData = {
          ...result.data,
          updated_at: new Date().toISOString(),
        };
        if (id) {
          const { error } = await supabase.from("profiles").update(profileData).eq("id", id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: id };
        }
        const existing = await supabase.from("profiles").select("id").limit(1).maybeSingle();
        if (existing.error) return databaseFailure(collection, existing.error);
        if (existing.data) {
          const { error } = await supabase.from("profiles").update(profileData).eq("id", existing.data.id);
          return error ? databaseFailure(collection, error) : { ok: true, recordId: existing.data.id };
        }
        const { data, error } = await supabase.from("profiles").insert(profileData).select("id").single();
        if (!error) return { ok: true, recordId: data.id };
        if (error.code === "23505") {
          const winner = await supabase.from("profiles").select("id").limit(1).maybeSingle();
          if (!winner.error && winner.data) {
            const retry = await supabase.from("profiles").update(profileData).eq("id", winner.data.id);
            return retry.error ? databaseFailure(collection, retry.error) : { ok: true, recordId: winner.data.id };
          }
        }
        return databaseFailure(collection, error);
      }
    }
  } catch {
    logContentFailure(collection);
    return { ok: false, message: "The save operation failed unexpectedly. Your form values are still available to retry." };
  }
}

function validationMessage(error: z.ZodError) {
  const first = error.issues[0];
  if (!first) return "Check the form fields and try again.";
  const field = first.path[0];
  const fieldLabel = typeof field === "string" ? field.replaceAll("_", " ") : "field";
  return `Check the ${fieldLabel} field: ${first.message}`;
}

function databaseFailure(collection: AdminCollection, error: { code?: string; status?: number }) {
  logContentFailure(collection, error.code, error.status);
  if (error.code === "23505") {
    return { ok: false as const, message: "A record with this unique value already exists. Edit the existing record instead." };
  }
  if (error.code === "42501") {
    return { ok: false as const, message: "Supabase denied this operation. Verify administrator membership and the existing RLS policy." };
  }
  return { ok: false as const, message: "Supabase could not save this record. Your form values are still available to retry." };
}

async function deleteRecord(
  supabase: Awaited<ReturnType<typeof getAdminContext>> extends infer C ? NonNullable<C> extends { supabase: infer S } ? S : never : never,
  collection: AdminCollection,
  id: string,
): Promise<boolean> {
  try {
    switch (collection) {
      case "projects": return !(await supabase.from("projects").delete().eq("id", id)).error;
      case "experiences": return !(await supabase.from("experiences").delete().eq("id", id)).error;
      case "education": return !(await supabase.from("education").delete().eq("id", id)).error;
      case "skills": return !(await supabase.from("skills").delete().eq("id", id)).error;
      case "research": return !(await supabase.from("research").delete().eq("id", id)).error;
      case "posts": return !(await supabase.from("posts").delete().eq("id", id)).error;
      case "contact_messages": return !(await supabase.from("contact_messages").delete().eq("id", id)).error;
      case "profiles": return !(await supabase.from("profiles").delete().eq("id", id)).error;
    }
  } catch {
    return false;
  }
}
