"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminContext } from "@/src/lib/auth/require-admin";
import { createClient } from "@/src/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(1024),
});

const genericLoginError = "Unable to sign in with those credentials.";

type LoginActionState = {
  error?: string;
  emailError?: string;
  passwordError?: string;
};

export async function loginAdmin(
  _previousState: LoginActionState | undefined,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      emailError: fieldErrors.email?.[0],
      passwordError: fieldErrors.password?.[0],
    };
  }

  let supabase: Awaited<ReturnType<typeof createClient>> | undefined;

  try {
    supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) return { error: genericLoginError };

    const adminContext = await getAdminContext(supabase);

    if (!adminContext) {
      await supabase.auth.signOut({ scope: "local" });
      return { error: genericLoginError };
    }
  } catch {
    if (supabase) {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // Keep authentication failures generic and avoid exposing provider details.
      }
    }

    return { error: genericLoginError };
  }

  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } finally {
    redirect("/admin/login");
  }
}