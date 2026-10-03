import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAdminContext } from "@/src/lib/auth/require-admin";
import { issueRecoveryMarker } from "@/src/lib/auth/recovery-marker";
import {
  ADMIN_RECOVERY_COOKIE,
  ADMIN_RECOVERY_COOKIE_MAX_AGE,
} from "@/src/lib/auth/recovery-session-constants";
import type { Database } from "@/src/types/database.types";

const productionOrigin = "https://aman-portfolio-aman1684.vercel.app";
const allowedOrigins = new Set([
  productionOrigin,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const allowedNextPaths = new Set(["/admin/reset-password"]);

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const next = requestUrl.searchParams.get("next");
  const origin = allowedOrigins.has(requestUrl.origin)
    ? requestUrl.origin
    : productionOrigin;
  const successUrl = new URL("/admin/reset-password", origin);
  const expiredUrl = new URL("/admin/reset-password?error=expired", origin);
  const redirectToExpiredPage = () => {
    const response = NextResponse.redirect(expiredUrl, { status: 303 });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  };

  if (!next || !allowedNextPaths.has(next)) {
    return redirectToExpiredPage();
  }

  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const hasPkceCode = Boolean(code);
  const hasRecoveryToken = Boolean(tokenHash) && type === "recovery";

  if (hasPkceCode === hasRecoveryToken || (tokenHash && type !== "recovery")) {
    return redirectToExpiredPage();
  }

  const pendingCookies = new Map<
    string,
    {
      name: string;
      value: string;
      options?: Parameters<NextResponse["cookies"]["set"]>[2];
    }
  >();
  const pendingHeaders = new Map<string, string>();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, cacheHeaders) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value);
            pendingCookies.set(cookie.name, cookie);
          }

          for (const [name, value] of Object.entries(cacheHeaders)) {
            pendingHeaders.set(name, value);
          }
        },
      },
    },
  );

  let adminUserId: string | null = null;
  let recoveryMarker: string | null = null;
  let sessionEstablished = false;

  try {
    const { error } = hasPkceCode
      ? await supabase.auth.exchangeCodeForSession(code!)
      : await supabase.auth.verifyOtp({
          token_hash: tokenHash!,
          type: "recovery",
        });

    if (!error) {
      sessionEstablished = true;
      const adminContext = await getAdminContext(supabase);
      adminUserId = adminContext?.user.id ?? null;
      if (adminUserId) recoveryMarker = issueRecoveryMarker(adminUserId);
    }

    if (sessionEstablished && !recoveryMarker) {
      adminUserId = null;
      await supabase.auth.signOut({ scope: "local" });
    }
  } catch {
    adminUserId = null;
    recoveryMarker = null;

    if (sessionEstablished) {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // Invalid or expired recovery links always fail closed.
      }
    }
  }

  const response = NextResponse.redirect(
    recoveryMarker ? successUrl : expiredUrl,
    { status: 303 },
  );

  for (const cookie of pendingCookies.values()) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }

  if (recoveryMarker) {
    response.cookies.set(ADMIN_RECOVERY_COOKIE, recoveryMarker, {
      httpOnly: true,
      secure: requestUrl.protocol === "https:",
      sameSite: "lax",
      path: "/admin/reset-password",
      maxAge: ADMIN_RECOVERY_COOKIE_MAX_AGE,
    });
  }

  for (const [name, value] of pendingHeaders) {
    response.headers.set(name, value);
  }

  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}