"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  ADMIN_RECOVERY_COOKIE,
  getRecoveryAdminContext,
} from "@/src/lib/auth/recovery-session";
import { createClient } from "@/src/lib/supabase/server";

const productionOrigin = "https://aman-portfolio-aman1684.vercel.app";
const developmentOrigin = "http://localhost:3000";

function getRecoveryRedirectTo() {
  const expectedOrigin =
    process.env.NODE_ENV === "production" ? productionOrigin : developmentOrigin;
  const configuredBaseUrl = process.env.APP_BASE_URL;

  if (!configuredBaseUrl) {
    throw new Error("APP_BASE_URL is required for password recovery.");
  }

  let parsedBaseUrl: URL;

  try {
    parsedBaseUrl = new URL(configuredBaseUrl);
  } catch {
    throw new Error("APP_BASE_URL must be a valid application origin.");
  }

  if (
    parsedBaseUrl.origin !== configuredBaseUrl ||
    parsedBaseUrl.origin !== expectedOrigin ||
    parsedBaseUrl.pathname !== "/" ||
    parsedBaseUrl.search !== "" ||
    parsedBaseUrl.hash !== "" ||
    parsedBaseUrl.username !== "" ||
    parsedBaseUrl.password !== ""
  ) {
    throw new Error("APP_BASE_URL is not an allowed application origin.");
  }

  return `${parsedBaseUrl.origin}/auth/callback?next=/admin/reset-password`;
}

const recoveryRequestSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(12, "Use at least 12 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RecoveryRequestState = {
  emailError?: string;
  success?: boolean;
};

export type PasswordUpdateState = {
  passwordError?: string;
  confirmPasswordError?: string;
  error?: string;
  success?: boolean;
};

function logPasswordUpdateFailure(error: unknown) {
  const details: {
    name?: string;
    code?: string;
    status?: number;
  } = {};

  if (error && typeof error === "object") {
    const candidate = error as {
      name?: unknown;
      code?: unknown;
      status?: unknown;
    };

    if (
      typeof candidate.name === "string" &&
      /^[a-z][a-z0-9_.-]{0,79}$/i.test(candidate.name)
    ) {
      details.name = candidate.name;
    }

    if (
      typeof candidate.code === "string" &&
      /^[a-z0-9_-]{1,80}$/i.test(candidate.code)
    ) {
      details.code = candidate.code;
    }

    if (
      typeof candidate.status === "number" &&
      Number.isInteger(candidate.status) &&
      candidate.status >= 100 &&
      candidate.status <= 599
    ) {
      details.status = candidate.status;
    }
  }

  console.error("[admin-password-recovery] auth.updateUser failed", details);
}

export async function requestAdminPasswordReset(
  _previousState: RecoveryRequestState | undefined,
  formData: FormData,
): Promise<RecoveryRequestState> {
  const parsed = recoveryRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { emailError: parsed.error.flatten().fieldErrors.email?.[0] };
  }

  try {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: getRecoveryRedirectTo(),
    });
  } catch {
    // Keep responses identical whether the account exists or the provider fails.
  }

  return { success: true };
}

export async function updateAdminPassword(
  _previousState: PasswordUpdateState | undefined,
  formData: FormData,
): Promise<PasswordUpdateState> {
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      passwordError: fieldErrors.password?.[0],
      confirmPasswordError: fieldErrors.confirmPassword?.[0],
    };
  }

  const context = await getRecoveryAdminContext();

  if (!context) {
    return {
      error: "This recovery link has expired. Request a new password reset email.",
    };
  }

  let updateError: Error | null = null;

  try {
    const { error } = await context.supabase.auth.updateUser({
      password: parsed.data.password,
    });
    updateError = error;
    if (error) logPasswordUpdateFailure(error);
  } catch (error) {
    logPasswordUpdateFailure(error);
    updateError = new Error("Password update failed");
  }

  if (updateError) {
    return {
      error: "Unable to update the password. Request a new recovery email and try again.",
    };
  }

  try {
    await context.supabase.auth.signOut({ scope: "local" });
  } catch {
    // Password update succeeded; never change that result due to logout errors.
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_RECOVERY_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin/reset-password",
      maxAge: 0,
    });
  } catch {
    // The local Supabase sign-out already clears the recovery session cookies.
  }

  return { success: true };
}