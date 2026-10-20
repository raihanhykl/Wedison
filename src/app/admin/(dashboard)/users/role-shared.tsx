"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import { ROLE_COLOR_CLASS, type PermissionCatalog, type Role, type RoleRef } from "@/lib/admin/types";

export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: () => api<{ items: Role[] }>("/admin/roles").then((r) => r.items), staleTime: 60_000 });
}

export function useRoleCatalog() {
  return useQuery({ queryKey: ["roles-catalog"], queryFn: () => api<{ data: PermissionCatalog }>("/admin/roles/catalog").then((r) => r.data), staleTime: 10 * 60_000 });
}

export function RoleBadge({ role, className }: { role: RoleRef; className?: string }) {
  const c = role.color ? ROLE_COLOR_CLASS[role.color] : null;
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", c?.badge, className)}>
      <span className={cn("size-1.5 rounded-full", c?.dot ?? "bg-muted-foreground")} />
      {role.name}
    </Badge>
  );
}

export function RoleDot({ role, className }: { role: Pick<RoleRef, "color">; className?: string }) {
  return <span className={cn("inline-block size-2.5 shrink-0 rounded-full", role.color ? ROLE_COLOR_CLASS[role.color].dot : "bg-muted-foreground", className)} />;
}

/** Transitive closure of `implies` for the given keys (mirrors normalizePermissions on the server). */
export function expandPermissions(keys: Iterable<string>, catalog: PermissionCatalog) {
  const index = new Map(catalog.modules.flatMap((m) => m.permissions.map((p) => [p.key, p] as const)));
  const out = new Set<string>();
  const visit = (k: string) => {
    if (out.has(k) || !index.has(k)) return;
    out.add(k);
    index.get(k)!.implies?.forEach(visit);
  };
  for (const k of keys) visit(k);
  return out;
}

/** Keys that (transitively) imply `target`; used when unticking a permission others depend on. */
export function dependentsOf(target: string, catalog: PermissionCatalog) {
  const all = catalog.modules.flatMap((m) => m.permissions.map((p) => p.key));
  return all.filter((k) => k !== target && expandPermissions([k], catalog).has(target));
}

export function describePermissions(role: Role, catalog?: PermissionCatalog) {
  if (role.permissions.includes("*")) return [{ module: "Everything", detail: "All modules and actions" }];
  if (!catalog) return [];
  return catalog.modules
    .map((m) => {
      const granted = m.permissions.filter((p) => role.permissions.includes(p.key));
      if (!granted.length) return null;
      const all = granted.length === m.permissions.length;
      return { module: m.label, detail: all ? "Full access" : granted.map((p) => p.label).join(", ") };
    })
    .filter((x): x is { module: string; detail: string } => !!x);
}
