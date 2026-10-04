"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactMessage } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  website: z.string().max(200).optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  function onSubmit(values: ContactValues) {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await submitContactMessage(values);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      setSuccess(true);
      form.reset();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-border/70 bg-card/50 p-5 sm:p-6"
      noValidate
    >
      <div className="absolute left-[-10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <Input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          {...form.register("website")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          error={form.formState.errors.name?.message}
        >
          <Input
            autoComplete="name"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
        </Field>
        <Field
          label="Email"
          error={form.formState.errors.email?.message}
        >
          <Input
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </Field>
      </div>
      <Field
        label="Subject"
        error={form.formState.errors.subject?.message}
      >
        <Input
          aria-invalid={Boolean(form.formState.errors.subject)}
          {...form.register("subject")}
        />
      </Field>
      <Field
        label="Message"
        error={form.formState.errors.message?.message}
      >
        <Textarea
          rows={6}
          aria-invalid={Boolean(form.formState.errors.message)}
          {...form.register("message")}
        />
      </Field>

      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-electric" role="status">
          Message sent. Thanks for reaching out.
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
