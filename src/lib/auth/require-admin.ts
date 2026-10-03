import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/src/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export type AdminContext = {
  supabase: ServerSupabaseClient;
  user: User;
};

export async function getAdminContext(
  existingClient?: ServerSupabaseClient,
): Promise<AdminContext | null> {
  try {
    const supabase = existingClient ?? (await createClient());
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

    if (adminError || isAdmin !== true) return null;

    return { supabase, user };
  } catch {
    return null;
  }
}

const getRequestAdminContext = cache(async () => getAdminContext());

export async function requireAdmin(): Promise<AdminContext> {
  const context = await getRequestAdminContext();

  if (!context) redirect("/admin/login");

  return context;
}