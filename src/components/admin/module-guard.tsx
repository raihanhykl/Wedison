"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canAccess, homeFor, moduleForPath } from "@/lib/admin/permissions";
import { useAdminUser } from "./providers";

/**
 * Hides pages a role cannot use. The dashboard root redirects to the role's home
 * (e.g. HR users land on /admin/hr); other forbidden pages show a clear message.
 */
export function ModuleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAdminUser();
  const mod = moduleForPath(pathname);
  const allowed = !mod || canAccess(user.role, mod);
  const isRoot = (pathname.replace(/\/+$/, "") || "/") === "/admin";

  useEffect(() => {
    if (!allowed && isRoot) router.replace(homeFor(user.role));
  }, [allowed, isRoot, router, user.role]);

  if (allowed) return <>{children}</>;
  if (isRoot) return null;
  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border border-border bg-card p-8 text-center">
      <ShieldAlert className="mx-auto size-8 text-muted-foreground" />
      <h1 className="mt-4 font-display text-xl font-bold tracking-tight">No access to this page</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your role does not include this module. Ask a Super Admin if you need access.</p>
      <Button asChild className="mt-6">
        <Link href={homeFor(user.role)}>Go to my workspace</Link>
      </Button>
    </div>
  );
}
