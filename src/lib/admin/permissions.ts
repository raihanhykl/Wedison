// Mirror of server/src/lib/permissions.ts (module -> view permission). The backend is the real
// enforcement; this only hides navigation and pages the user's role cannot use.
import type { AuthUser } from "./types";

export type Module = "dashboard" | "cms" | "supercharge" | "leads" | "hr" | "users" | "activity" | "consent";

type Holder = Pick<AuthUser, "permissions">;

export function hasPermission(user: Holder, permission: string) {
  return user.permissions.includes("*") || user.permissions.includes(permission);
}

const MODULE_VIEW_PERMISSION: Record<Module, string> = {
  dashboard: "dashboard.view",
  cms: "cms.view",
  supercharge: "supercharge.view",
  leads: "leads.view",
  hr: "hr.view",
  users: "users.manage",
  activity: "activity.view",
  consent: "consent.view",
};

export function canAccess(user: Holder, module: Module) {
  return hasPermission(user, MODULE_VIEW_PERMISSION[module]);
}

export function canWrite(user: Holder, module: Module) {
  return hasPermission(user, `${module}.write`);
}

/** Permanent deletes inside a module. */
export function canDelete(user: Holder, module: Module) {
  return hasPermission(user, `${module}.delete`);
}

/** Landing page after login / when opening a page the role cannot use. */
export function homeFor(user: Holder) {
  if (canAccess(user, "dashboard")) return "/admin";
  if (canAccess(user, "hr")) return "/admin/hr";
  if (canAccess(user, "supercharge")) return "/admin/supercharge/stations";
  if (canAccess(user, "cms")) return "/admin/cms/articles";
  if (canAccess(user, "leads")) return "/admin/leads";
  if (canAccess(user, "users")) return "/admin/users";
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
