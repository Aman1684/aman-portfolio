"use server";

import { z } from "zod";
import { headers } from "next/headers";

import { createClient } from "@/src/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional(),
});

const contactRateLimitWindowMs = 10 * 60 * 1000;
const maxContactSubmissionsPerWindow = 5;
const contactSubmissionWindows = new Map<string, { count: number; expiresAt: number }>();

async function isContactRateLimited() {
  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-real-ip") ?? "unknown-client";
  const now = Date.now();

  for (const [key, window] of contactSubmissionWindows) {
    if (window.expiresAt <= now) contactSubmissionWindows.delete(key);
  }

  const existing = contactSubmissionWindows.get(clientIp);
  if (!existing || existing.expiresAt <= now) {
    contactSubmissionWindows.set(clientIp, {
      count: 1,
      expiresAt: now + contactRateLimitWindowMs,
    });
    return false;
  }

  if (existing.count >= maxContactSubmissionsPerWindow) return true;
  existing.count += 1;
  return false;
}

export type ContactActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContactMessage(
  input: z.infer<typeof contactSchema>,
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  if (parsed.data.website) {
    return { ok: true };
  }

  if (await isContactRateLimited()) {
    return {
      ok: false,
      error: "Too many messages were sent. Please wait a few minutes and try again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
  });

  if (error) {
    return {
      ok: false,
      error: "Unable to send your message right now. Please try again later.",
    };
  }

  return { ok: true };
}
