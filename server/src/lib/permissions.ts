/**
 * Single source of truth for role-based access in the admin.
 * - Modules: which admin areas a role can open at all (router-level guard).
 * - Write / delete: what a role may change inside a module it can open.
 * - HR actions: finer permissions inside the HR module (approval workflow).
 * Mirrored in the frontend at src/lib/admin/permissions.ts (keep in sync).
 */
import type { UserRole } from "../generated/prisma/enums.js";

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

/**
 * Permanent deletes (articles, press, social, topics/tags, bookings, contact messages,
 * stations). Team roles own their modules, so they may delete there; Editor may not.
 */
const DELETE_MODULES: Record<UserRole, Module[]> = {
  SUPER_ADMIN: ["cms", "supercharge", "leads"],
  ADMIN: ["cms", "supercharge", "leads"],
  EDITOR: [],
  MARKETING: ["cms", "leads"],
  SUPERCHARGE: ["supercharge"],
  HR_MANAGER: [],
  HR_STAFF: [],
};

export type HrAction =
  | "jobs.read"
  | "jobs.write" // create / edit drafts, duplicate, submit for review
  | "jobs.publish" // publish, close, reopen, archive, approve/return review
  | "jobs.delete"
  | "settings.write" // HR contact & application settings
  | "taxonomy.write"; // departments & locations

const ALL_HR: HrAction[] = ["jobs.read", "jobs.write", "jobs.publish", "jobs.delete", "settings.write", "taxonomy.write"];
const HR_ACTIONS: Record<UserRole, HrAction[]> = {
  SUPER_ADMIN: ALL_HR,
  HR_MANAGER: ALL_HR,
  HR_STAFF: ["jobs.read", "jobs.write"],
  ADMIN: [],
  EDITOR: [],
  MARKETING: [],
  SUPERCHARGE: [],
};

export function canAccess(role: UserRole, module: Module) {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}

/** Every role that can open a content module (cms, supercharge, leads) can create and edit there. */
export function canWrite(role: UserRole, module: Module) {
  return canAccess(role, module);
}

export function canDelete(role: UserRole, module: Module) {
  return DELETE_MODULES[role]?.includes(module) ?? false;
}

export function canHr(role: UserRole, action: HrAction) {
  return HR_ACTIONS[role]?.includes(action) ?? false;
}
