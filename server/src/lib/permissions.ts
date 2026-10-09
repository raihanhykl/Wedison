/**
 * Single source of truth for access control in the admin.
 *
 * Access is permission-based: every user has exactly one Role (DB model), and a role is a
 * set of permission keys from the catalog below. Roles are managed in the admin
 * (System > Users > Roles); the `super_admin` system role always holds "*".
 *
 * Helpers keep the module-oriented API the routers already use (`canAccess`, `canWrite`,
 * `canDelete`, `canHr`), implemented on top of `has()`.
 */

export type Module = "dashboard" | "cms" | "supercharge" | "leads" | "hr" | "users" | "activity" | "consent";

export type PermissionDef = {
  key: string;
  label: string;
  description: string;
  /** Granting this permission also grants these (enforced on save and shown in the UI). */
  implies?: string[];
};
export type ModuleDef = { key: Module; label: string; description: string; permissions: PermissionDef[] };

export const PERMISSION_CATALOG: ModuleDef[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Overview page with content, leads and station statistics.",
    permissions: [{ key: "dashboard.view", label: "View dashboard", description: "Open the overview and see aggregate numbers." }],
  },
  {
    key: "cms",
    label: "CMS · Media Center",
    description: "Articles, press coverage, social media, topics & tags, media library, SEO & AI readiness.",
    permissions: [
      { key: "cms.view", label: "View", description: "Open the CMS pages and read content." },
      { key: "cms.write", label: "Create & edit", description: "Write, edit, publish, schedule, upload media, import documents.", implies: ["cms.view"] },
      { key: "cms.delete", label: "Delete permanently", description: "Permanently delete articles, press, social posts, topics, tags and media.", implies: ["cms.write"] },
    ],
  },
  {
    key: "supercharge",
    label: "SuperCharge",
    description: "Charging station locations shown on the public locator.",
    permissions: [
      { key: "supercharge.view", label: "View", description: "Open the station list and map." },
      { key: "supercharge.write", label: "Create & edit", description: "Add, edit and bulk-update stations.", implies: ["supercharge.view"] },
      { key: "supercharge.delete", label: "Delete", description: "Delete stations.", implies: ["supercharge.write"] },
    ],
  },
  {
    key: "leads",
    label: "Leads",
    description: "Showroom bookings, contact messages, calendar and lead analytics.",
    permissions: [
      { key: "leads.view", label: "View", description: "Open bookings, contact messages, calendar and analytics." },
      { key: "leads.write", label: "Handle leads", description: "Update booking status, mark messages handled, add notes, sync calendar.", implies: ["leads.view"] },
      { key: "leads.delete", label: "Delete", description: "Delete bookings and contact messages.", implies: ["leads.write"] },
    ],
  },
  {
    key: "hr",
    label: "HR · Careers",
    description: "Job openings, divisions & locations, HR contact settings.",
    permissions: [
      { key: "hr.view", label: "View", description: "Open the HR module and read job openings." },
      { key: "hr.jobs.write", label: "Write jobs", description: "Create and edit draft jobs, duplicate, submit for review.", implies: ["hr.view"] },
      { key: "hr.jobs.publish", label: "Publish & close jobs", description: "Approve or return reviews, publish, close, reopen and archive jobs.", implies: ["hr.jobs.write"] },
      { key: "hr.jobs.delete", label: "Delete jobs", description: "Permanently delete job openings.", implies: ["hr.jobs.write"] },
      { key: "hr.taxonomy.write", label: "Divisions & locations", description: "Manage divisions and office locations.", implies: ["hr.view"] },
      { key: "hr.settings.write", label: "HR contact & settings", description: "Edit HR contact details and application settings.", implies: ["hr.view"] },
    ],
  },
  {
    key: "users",
    label: "Users & Roles",
    description: "Team accounts and custom roles.",
    permissions: [{ key: "users.manage", label: "Manage users & roles", description: "Create, edit, deactivate and delete users; create and edit roles." }],
  },
  {
    key: "activity",
    label: "Activity Log",
    description: "Audit trail of admin actions.",
    permissions: [{ key: "activity.view", label: "View activity log", description: "See who changed what and when." }],
  },
  {
    key: "consent",
    label: "Cookie Consent",
    description: "Aggregated cookie-consent statistics.",
    permissions: [{ key: "consent.view", label: "View consent stats", description: "See consent acceptance statistics." }],
  },
];

export const ALL_PERMISSIONS: string[] = PERMISSION_CATALOG.flatMap((m) => m.permissions.map((p) => p.key));
const PERMISSION_INDEX = new Map(PERMISSION_CATALOG.flatMap((m) => m.permissions.map((p) => [p.key, p] as const)));
export const SUPER_ADMIN_KEY = "super_admin";
export const WILDCARD = "*";

/** Minimal shape the helpers need; `req.user` and the frontend AuthUser both satisfy it. */
export type PermissionHolder = { permissions: readonly string[] };

export function isKnownPermission(key: string) {
  return PERMISSION_INDEX.has(key);
}

/** Expand implied permissions (transitively), drop unknown keys and duplicates, sort. */
export function normalizePermissions(keys: readonly string[]): string[] {
  const out = new Set<string>();
  const visit = (k: string) => {
    if (out.has(k)) return;
    const def = PERMISSION_INDEX.get(k);
    if (!def) return;
    out.add(k);
    def.implies?.forEach(visit);
  };
  keys.forEach(visit);
  return ALL_PERMISSIONS.filter((k) => out.has(k)); // catalog order
}

/** Keys that are not in the catalog (used for validation messages). */
export function unknownPermissions(keys: readonly string[]) {
  return keys.filter((k) => k !== WILDCARD && !PERMISSION_INDEX.has(k));
}

export function has(user: PermissionHolder, permission: string) {
  const p = user.permissions;
  return p.includes(WILDCARD) || p.includes(permission);
}

/** Permission that opens a module at all (router-level guard / navigation). */
export const MODULE_VIEW_PERMISSION: Record<Module, string> = {
  dashboard: "dashboard.view",
  cms: "cms.view",
  supercharge: "supercharge.view",
  leads: "leads.view",
  hr: "hr.view",
  users: "users.manage",
  activity: "activity.view",
  consent: "consent.view",
};

export function canAccess(user: PermissionHolder, module: Module) {
  return has(user, MODULE_VIEW_PERMISSION[module]);
}

export function canWrite(user: PermissionHolder, module: Module) {
  return has(user, `${module}.write`);
}

export function canDelete(user: PermissionHolder, module: Module) {
  return has(user, `${module}.delete`);
}

export type HrAction = "jobs.read" | "jobs.write" | "jobs.publish" | "jobs.delete" | "settings.write" | "taxonomy.write";

export function canHr(user: PermissionHolder, action: HrAction) {
  return action === "jobs.read" ? has(user, "hr.view") : has(user, `hr.${action}`);
}

/** True when the holder can manage users & roles (the "admin lockout" guard uses this). */
export function canManageUsers(user: PermissionHolder) {
  return has(user, "users.manage");
}
