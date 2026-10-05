/**
 * Single source of truth for role-based access in the admin.
 * - Modules: which admin areas a role can open at all (router-level guard).
 * - HR actions: finer permissions inside the HR module (approval workflow).
 * Mirrored in the frontend at src/lib/admin/permissions.ts (keep in sync).
 */
import type { UserRole } from "../generated/prisma/enums.js";

export type Module = "dashboard" | "cms" | "supercharge" | "leads" | "hr" | "users" | "activity" | "consent";

export const ROLE_MODULES: Record<UserRole, Module[]> = {
  SUPER_ADMIN: ["dashboard", "cms", "supercharge", "leads", "hr", "users", "activity", "consent"],
  ADMIN: ["dashboard", "cms", "supercharge", "leads", "activity", "consent"],
  EDITOR: ["dashboard", "cms", "supercharge", "leads"],
  HR_MANAGER: ["hr"],
  HR_STAFF: ["hr"],
};

export type HrAction =
  | "jobs.read"
  | "jobs.write" // create / edit drafts, duplicate, submit for review
  | "jobs.publish" // publish, close, reopen, archive, approve/return review
  | "jobs.delete"
  | "settings.write" // HR contact & application settings
  | "taxonomy.write"; // departments & locations

const HR_ACTIONS: Record<UserRole, HrAction[]> = {
  SUPER_ADMIN: ["jobs.read", "jobs.write", "jobs.publish", "jobs.delete", "settings.write", "taxonomy.write"],
  HR_MANAGER: ["jobs.read", "jobs.write", "jobs.publish", "jobs.delete", "settings.write", "taxonomy.write"],
  HR_STAFF: ["jobs.read", "jobs.write"],
  ADMIN: [],
  EDITOR: [],
};

export function canAccess(role: UserRole, module: Module) {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}

export function canHr(role: UserRole, action: HrAction) {
  return HR_ACTIONS[role]?.includes(action) ?? false;
}
