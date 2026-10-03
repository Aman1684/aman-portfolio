"use server";

import { z } from "zod";

import { createClient } from "@/src/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
});

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
