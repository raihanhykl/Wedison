// Mirror of server/src/lib/permissions.ts (keep in sync). The backend is the real
// enforcement; this only hides navigation and pages a role cannot use.
import type { UserRole } from "./types";

export type Module = "dashboard" | "cms" | "supercharge" | "leads" | "hr" | "users" | "activity" | "consent";

export const ROLE_MODULES: Record<UserRole, Module[]> = {
  SUPER_ADMIN: ["dashboard", "cms", "supercharge", "leads", "hr", "users", "activity", "consent"],
  ADMIN: ["dashboard", "cms", "supercharge", "leads", "activity", "consent"],
  EDITOR: ["dashboard", "cms", "supercharge", "leads"],
  HR_MANAGER: ["hr"],
  HR_STAFF: ["hr"],
};

export function canAccess(role: UserRole, module: Module) {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}

/** Landing page after login / when opening a page the role cannot use. */
export function homeFor(role: UserRole) {
  return canAccess(role, "dashboard") ? "/admin" : canAccess(role, "hr") ? "/admin/hr" : "/admin/settings";
}

/** Path prefix → module (longest prefix wins). Paths not listed are open to every role. */
const PREFIXES: [string, Module][] = [
  ["/admin/cms", "cms"],
  ["/admin/seo", "cms"],
  ["/admin/supercharge", "supercharge"],
  ["/admin/leads", "leads"],
  ["/admin/hr", "hr"],
  ["/admin/users", "users"],
  ["/admin/activity", "activity"],
];

export function moduleForPath(pathname: string): Module | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/admin") return "dashboard";
  const hit = PREFIXES.filter(([pre]) => p === pre || p.startsWith(`${pre}/`)).sort((a, b) => b[0].length - a[0].length)[0];
  return hit ? hit[1] : null;
}
