import "server-only";

import { cookies } from "next/headers";

import { getAdminContext } from "@/src/lib/auth/require-admin";
import {
  ADMIN_RECOVERY_COOKIE,
  ADMIN_RECOVERY_COOKIE_MAX_AGE,
} from "@/src/lib/auth/recovery-session-constants";
import { verifyRecoveryMarkerForUser } from "@/src/lib/auth/recovery-marker";

export { ADMIN_RECOVERY_COOKIE, ADMIN_RECOVERY_COOKIE_MAX_AGE };

export async function getRecoveryAdminContext() {
  try {
    const cookieStore = await cookies();
    const recoveryMarker = cookieStore.get(ADMIN_RECOVERY_COOKIE)?.value;

    if (!recoveryMarker) return null;

    const context = await getAdminContext();

    if (
      !context ||
      !verifyRecoveryMarkerForUser(recoveryMarker, context.user.id)
    ) {
      return null;
    }

    return context;
  } catch {
    return null;
  }
}