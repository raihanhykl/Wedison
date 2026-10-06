// Mirror of server/src/lib/permissions.ts (keep in sync). The backend is the real
// enforcement; this only hides navigation and pages a role cannot use.
import type { UserRole } from "./types";

export type Module = "dashboard" | "cms" | "supercharge" | "leads" | "hr" | "users" | "activity" | "consent";

export const ROLE_MODULES: Record<UserRole, Module[]> = {
  SUPER_ADMIN: ["dashboard", "cms", "supercharge", "leads", "hr", "users", "activity", "consent"],
  ADMIN: ["dashboard", "cms", "supercharge", "leads", "activity", "consent"],
  EDITOR: ["dashboard", "cms", "supercharge", "leads"],
  MARKETING: ["dashboard", "cms", "leads"],
  SUPERCHARGE: ["supercharge"],
  HR_MANAGER: ["hr"],
  HR_STAFF: ["hr"],
};

const DELETE_MODULES: Record<UserRole, Module[]> = {
  SUPER_ADMIN: ["cms", "supercharge", "leads"],
  ADMIN: ["cms", "supercharge", "leads"],
  EDITOR: [],
  MARKETING: ["cms", "leads"],
  SUPERCHARGE: ["supercharge"],
  HR_MANAGER: [],
  HR_STAFF: [],
};

export function canAccess(role: UserRole, module: Module) {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}

/** Permanent deletes inside a module (Editor: none; team roles: their own modules). */
export function canDelete(role: UserRole, module: Module) {
  return DELETE_MODULES[role]?.includes(module) ?? false;
}

/** Landing page after login / when opening a page the role cannot use. */
export function homeFor(role: UserRole) {
  if (canAccess(role, "dashboard")) return "/admin";
  if (canAccess(role, "hr")) return "/admin/hr";
  if (canAccess(role, "supercharge")) return "/admin/supercharge/stations";
  if (canAccess(role, "cms")) return "/admin/cms/articles";
  return "/admin/settings";
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
