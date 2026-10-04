"use server";

import "server-only";

import { randomUUID } from "node:crypto";

import { getAdminContext } from "@/src/lib/auth/require-admin";

const maxUploadBytes = 8 * 1024 * 1024;
const fileTypes = {
  "image/jpeg": { extension: "jpg", signature: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  "image/png": { extension: "png", signature: (bytes: Uint8Array) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 },
  "image/webp": { extension: "webp", signature: (bytes: Uint8Array) => bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50 },
  "application/pdf": { extension: "pdf", signature: (bytes: Uint8Array) => bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 },
} as const;

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

export async function uploadPortfolioAsset(formData: FormData): Promise<UploadResult> {
  const admin = await getAdminContext();
  if (!admin) return { ok: false, error: "Administrator authorization is required." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > maxUploadBytes) {
    return { ok: false, error: "Choose a file smaller than 8 MB." };
  }

  const type = file.type as keyof typeof fileTypes;
  const fileType = fileTypes[type];
  if (!fileType) return { ok: false, error: "Use a JPEG, PNG, WebP, or PDF file." };

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!fileType.signature(bytes)) {
    return { ok: false, error: "The uploaded file content does not match its file type." };
  }

  const bucket = process.env.PORTFOLIO_PUBLIC_BUCKET;
  if (!bucket || !/^[a-z0-9][a-z0-9_-]{0,62}$/.test(bucket)) {
    return { ok: false, error: "Portfolio asset storage is not configured." };
  }

  const path = `portfolio/${admin.user.id}/${randomUUID()}.${fileType.extension}`;

  try {
    const { error } = await admin.supabase.storage.from(bucket).upload(path, bytes, {
      contentType: type,
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      console.error("[admin-asset-upload] storage upload rejected", {
        statusCode: /^[0-9]{3}$/.test(error.statusCode ?? "") ? error.statusCode : undefined,
        errorName: /^[a-z][a-z0-9_.-]{0,79}$/i.test(error.name) ? error.name : undefined,
      });
      return { ok: false, error: "Upload was rejected by storage. Check the bucket and admin upload policy." };
    }

    const { data } = admin.supabase.storage.from(bucket).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch {
    console.error("[admin-asset-upload] storage request failed");
    return { ok: false, error: "The file could not be uploaded. Please try again." };
  }
}
