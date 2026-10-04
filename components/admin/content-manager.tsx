"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Check, Plus, Save, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { mutateAdminContent, type ContentActionState } from "@/src/lib/admin/content-actions";
import type { AdminField } from "@/src/lib/admin/content-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadPortfolioAsset } from "@/src/lib/admin/upload-action";

export function ContentManager({
  collection,
  title,
  fields,
  records,
}: {
  collection: string;
  title: string;
  fields: readonly AdminField[];
  records: Record<string, unknown>[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [state, formAction] = useActionState<ContentActionState, FormData>(mutateAdminContent, undefined);
  const activeId = selectedId === "" ? null : selectedId ?? (state?.success ? state.recordId ?? null : null);
  const selected = records.find((record) => record.id === activeId) ?? null;

  useEffect(() => {
    if (state?.success && state.recordId) {
      router.refresh();
    }
  }, [router, state?.recordId, state?.success]);

  function startNew() {
    setSelectedId("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section aria-labelledby="records-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="records-heading" className="font-heading text-lg font-medium">Records</h2>
            <p className="mt-1 text-sm text-muted-foreground">{records.length} item{records.length === 1 ? "" : "s"}</p>
          </div>
          <Button type="button" onClick={startNew} size="sm">
            <Plus data-icon="inline-start" />
            New {title.replace(/s$/, "").toLowerCase()}
          </Button>
        </div>

        {records.length ? (
          <div className="space-y-2">
            {records.map((record) => {
              const recordId = String(record.id ?? "");
              const primary = String(record.title ?? record.company ?? record.institution ?? record.name ?? record.full_name ?? "Untitled");
              const secondary = String(record.slug ?? record.role ?? record.degree ?? record.category ?? record.status ?? "");
              return (
                <article key={recordId} className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${activeId === recordId ? "border-electric/45 bg-electric/5" : "border-border/70 bg-card/40"}`}>
                  <button type="button" onClick={() => setSelectedId(recordId)} className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-medium">{primary}</span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">{secondary || "Select to edit"}</span>
                  </button>
                  {collection === "profiles" ? null : (
                    <DeleteRecordButton collection={collection} id={recordId} label={primary} />
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-card/30 px-5 py-10 text-center">
            <p className="text-sm font-medium">No records yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create the first record using the form.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="editor-heading" className="rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5">
        <div className="mb-5">
          <p className="text-xs font-medium tracking-[0.16em] text-electric uppercase">Content editor</p>
          <h2 id="editor-heading" className="mt-1 font-heading text-lg font-medium">{selected ? "Edit record" : "Create record"}</h2>
        </div>
        <form key={activeId ?? "new"} action={formAction} className="space-y-4">
          <input type="hidden" name="collection" value={collection} />
          <input type="hidden" name="operation" value="save" />
          {activeId ? <input type="hidden" name="id" value={activeId} /> : null}
          {fields.map((field) => (
            <EditorField key={field.name} field={field} value={selected?.[field.name]} />
          ))}
          {state?.error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{state.error}</p> : null}
          {state?.success ? <p className="inline-flex items-center gap-2 text-sm text-emerald-400" role="status"><Check className="size-4" /> Saved successfully.</p> : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <SaveButton />
            {selected ? <Button type="button" variant="outline" onClick={startNew}>Cancel edit</Button> : null}
          </div>
        </form>
      </section>
    </div>
  );
}

function EditorField({ field, value }: { field: AdminField; value: unknown }) {
  const stringValue = Array.isArray(value) ? value.join("\n") : value == null ? "" : String(value);
  const id = `field-${field.name}`;
  const common = {
    id,
    name: field.name,
    required: field.required,
    "aria-label": field.label,
  };

  if (field.type === "checkbox") {
    return (
      <label htmlFor={id} className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/45 px-3 py-3 text-sm">
        <input {...common} type="checkbox" defaultChecked={value === true} className="size-4 accent-electric" />
        {field.label}
      </label>
    );
  }

  if (field.name === "content") {
    return <MarkdownEditor defaultValue={stringValue} required={field.required} />;
  }

  if (
    field.type === "url" &&
    ["cover_image", "avatar_url", "resume_url", "paper_url"].includes(field.name)
  ) {
    return <AssetUrlField field={field} value={stringValue} />;
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{field.label}{field.required ? <span className="ml-1 text-electric" aria-hidden="true">*</span> : null}</label>
      {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
      {field.type === "textarea" || field.type === "list" ? (
        <Textarea {...common} rows={field.type === "list" ? 3 : field.name === "content" ? 14 : 5} defaultValue={stringValue} readOnly={field.readOnly} />
      ) : field.type === "select" ? (
        <select {...common} defaultValue={stringValue || field.options?.[0]} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <Input {...common} type={field.type ?? "text"} defaultValue={stringValue} readOnly={field.readOnly} className="h-10 bg-background/70 px-3" />
      )}
    </div>
  );
}

function MarkdownEditor({
  defaultValue,
  required,
}: {
  defaultValue: string;
  required?: boolean;
}) {
  const [content, setContent] = useState(defaultValue);
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Markdown source</p>
        <Button type="button" variant="outline" size="xs" onClick={() => setPreview((visible) => !visible)}>
          {preview ? "Edit source" : "Preview"}
        </Button>
      </div>
      {preview ? (
        <div className="min-h-72 rounded-lg border border-border/70 bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground [&_a]:text-electric [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-electric/60 [&_blockquote]:pl-3 [&_h1]:my-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h2]:my-3 [&_h2]:font-heading [&_h2]:text-xl [&_h3]:my-3 [&_h3]:font-heading [&_h3]:text-lg [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:my-3 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-surface [&_pre]:p-3 [&_ul]:my-3 [&_ul]:list-disc">
          {content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="text-muted-foreground/70">Markdown preview will appear here.</p>}
        </div>
      ) : (
        <Textarea
          id="field-content"
          name="content"
          rows={14}
          required={required}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          aria-label="Article content in Markdown"
        />
      )}
      {preview ? <input type="hidden" name="content" value={content} /> : null}
    </div>
  );
}

function AssetUrlField({ field, value }: { field: AdminField; value: string }) {
  const urlRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function uploadSelectedFile() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setError(null);
    const data = new FormData();
    data.set("file", file);
    startTransition(async () => {
      const result = await uploadPortfolioAsset(data);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (urlRef.current) urlRef.current.value = result.url;
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div className="space-y-2">
      <Input
        ref={urlRef}
        id={`field-${field.name}`}
        name={field.name}
        type="url"
        defaultValue={value}
        required={field.required}
        aria-label={field.label}
        className="h-10 bg-background/70 px-3"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Input
          ref={fileRef}
          type="file"
          accept={field.name === "resume_url" || field.name === "paper_url" ? "image/jpeg,image/png,image/webp,application/pdf" : "image/jpeg,image/png,image/webp"}
          aria-label={`Choose ${field.label.toLowerCase()} file`}
          className="h-10 min-w-0 flex-1 bg-background/70 px-2 py-1.5 text-xs"
        />
        <Button type="button" size="sm" variant="outline" onClick={uploadSelectedFile} disabled={pending}>
          {pending ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}
      <p className="text-xs text-muted-foreground">Images and PDF, up to 8 MB. Upload requires configured Supabase storage and owner RLS.</p>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}><Save data-icon="inline-start" />{pending ? "Saving…" : "Save changes"}</Button>;
}

function DeleteRecordButton({ collection, id, label }: { collection: string; id: string; label: string }) {
  const [state, formAction, pending] = useActionState<ContentActionState, FormData>(mutateAdminContent, undefined);
  return (
    <form action={formAction} onSubmit={(event) => {
      if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) event.preventDefault();
    }}>
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="operation" value="delete" />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="icon-sm" disabled={pending} aria-label={`Delete ${label}`} title={state?.error ?? "Delete record"}>
        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
      </Button>
    </form>
  );
}
