"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PublicSiteShell({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname === "/admin" || pathname?.startsWith("/admin/") === true;

  return (
    <>
      {isAdminRoute ? null : header}
      <main className="flex-1">{children}</main>
      {isAdminRoute ? null : footer}
    </>
  );
}