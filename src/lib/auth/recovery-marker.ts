import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { ADMIN_RECOVERY_COOKIE_MAX_AGE } from "@/src/lib/auth/recovery-session-constants";

const userIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const signaturePattern = /^[A-Za-z0-9_-]{43}$/;
const secretPattern = /^[A-Za-z0-9+/_-]+={0,2}$/;

function getSigningSecret(): string {
  const secret = process.env.ADMIN_RECOVERY_SECRET;

  if (
    !secret ||
    secret !== secret.trim() ||
    !secretPattern.test(secret) ||
    Buffer.byteLength(secret, "utf8") < 32
  ) {
    throw new Error("ADMIN_RECOVERY_SECRET is missing or invalid.");
  }

  return secret;
}

function signPayload(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload, "utf8").digest();
}

export function issueRecoveryMarker(userId: string, nowSeconds = Date.now() / 1000) {
  if (!userIdPattern.test(userId) || !Number.isFinite(nowSeconds)) {
    throw new Error("Cannot issue a recovery marker for invalid input.");
  }

  const expiresAt = Math.floor(nowSeconds) + ADMIN_RECOVERY_COOKIE_MAX_AGE;
  const payload = `v1.${userId}.${expiresAt}`;
  const signature = signPayload(payload, getSigningSecret()).toString("base64url");

  return `${payload}.${signature}`;
}

export function verifyRecoveryMarker(
  marker: string,
  nowSeconds = Date.now() / 1000,
): string | null {
  const parts = marker.split(".");

  if (parts.length !== 4 || parts[0] !== "v1") return null;

  const [, userId, expiresAtText, signatureText] = parts;

  if (
    !userIdPattern.test(userId) ||
    !/^\d{10}$/.test(expiresAtText) ||
    !signaturePattern.test(signatureText) ||
    !Number.isFinite(nowSeconds)
  ) {
    return null;
  }

  const expiresAt = Number(expiresAtText);

  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(nowSeconds)) {
    return null;
  }

  let suppliedSignature: Buffer;

  try {
    suppliedSignature = Buffer.from(signatureText, "base64url");
  } catch {
    return null;
  }

  if (
    suppliedSignature.length !== 32 ||
    suppliedSignature.toString("base64url") !== signatureText
  ) {
    return null;
  }

  let expectedSignature: Buffer;

  try {
    expectedSignature = signPayload(
      `v1.${userId}.${expiresAtText}`,
      getSigningSecret(),
    );
  } catch {
    return null;
  }

  if (
    expectedSignature.length !== suppliedSignature.length ||
    !timingSafeEqual(expectedSignature, suppliedSignature)
  ) {
    return null;
  }

  return userId;
}

export function verifyRecoveryMarkerForUser(
  marker: string,
  authenticatedUserId: string,
  nowSeconds = Date.now() / 1000,
): boolean {
  return verifyRecoveryMarker(marker, nowSeconds) === authenticatedUserId;
}