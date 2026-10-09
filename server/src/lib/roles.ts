import { z } from "zod";
import { prisma } from "./prisma.js";
import { badRequest, conflict, forbidden } from "./errors.js";
import { ALL_PERMISSIONS, normalizePermissions, unknownPermissions, SUPER_ADMIN_KEY, WILDCARD } from "./permissions.js";

/** Badge colors a role may use (rendered by the admin UI). */
export const ROLE_COLORS = ["emerald", "blue", "violet", "pink", "amber", "teal", "cyan", "rose", "orange", "indigo", "lime", "slate"] as const;
export type RoleColor = (typeof ROLE_COLORS)[number];

export const ROLE_KEY_RE = /^[a-z][a-z0-9_]{1,39}$/;
const RESERVED_KEYS = new Set([SUPER_ADMIN_KEY, "new", "catalog", "me", "system", "admin_root"]);

export function slugifyRoleKey(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^[^a-z]+/, "")
    .slice(0, 40);
}

export const roleSelect = {
  id: true,
  key: true,
  name: true,
  description: true,
  color: true,
  permissions: true,
  isSystem: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { users: true } },
} as const;

export const roleCreateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  key: z.string().trim().toLowerCase().regex(ROLE_KEY_RE, "Key must be 2–40 chars: lowercase letters, digits, underscores, starting with a letter").optional(),
  description: z.string().trim().max(300).nullable().optional(),
  color: z.enum(ROLE_COLORS).nullable().optional(),
  permissions: z.array(z.string().trim().min(1).max(60)).max(200).default([]),
});
export const roleUpdateSchema = roleCreateSchema.partial().extend({ key: z.string().optional() });

/** Validate + normalize the permission list of a non-system role. */
export function preparePermissions(keys: readonly string[]) {
  if (keys.includes(WILDCARD)) throw badRequest('The wildcard "*" is reserved for the Super Admin role');
  const unknown = unknownPermissions(keys);
  if (unknown.length) throw badRequest(`Unknown permission${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}`, unknown.map((k) => ({ path: "permissions", message: `unknown ${k}` })));
  return normalizePermissions(keys);
}

export function assertKeyAllowed(key: string) {
  if (!ROLE_KEY_RE.test(key)) throw badRequest("Key must be 2–40 chars: lowercase letters, digits, underscores, starting with a letter");
  if (RESERVED_KEYS.has(key)) throw badRequest(`"${key}" is a reserved key`);
}

/** Case-insensitive uniqueness for name / key (Postgres unique index is case-sensitive). */
export async function assertUnique(opts: { name?: string; key?: string; exceptId?: string }) {
  if (opts.name) {
    const hit = await prisma.role.findFirst({ where: { name: { equals: opts.name, mode: "insensitive" }, ...(opts.exceptId ? { NOT: { id: opts.exceptId } } : {}) }, select: { id: true } });
    if (hit) throw conflict(`A role named "${opts.name}" already exists`);
  }
  if (opts.key) {
    const hit = await prisma.role.findFirst({ where: { key: { equals: opts.key, mode: "insensitive" }, ...(opts.exceptId ? { NOT: { id: opts.exceptId } } : {}) }, select: { id: true } });
    if (hit) throw conflict(`A role with key "${opts.key}" already exists`);
  }
}

export function assertNotSystem(role: { isSystem: boolean; name: string }, what = "changed") {
  if (role.isSystem) throw forbidden(`The ${role.name} role is built in and cannot be ${what}`);
}

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * Admin-lockout guard: after a change (role permissions, user role, deactivation, deletion)
 * at least one ACTIVE user must still be able to manage users & roles. Call inside the same
 * transaction as the change so a violation rolls everything back.
 */
export async function assertManagersRemain(tx: Tx) {
  const n = await tx.user.count({ where: { isActive: true, role: { permissions: { hasSome: [WILDCARD, "users.manage"] } } } });
  if (n === 0) throw badRequest("This change would leave no active user who can manage users and roles");
}

export const PERMISSION_COUNT = ALL_PERMISSIONS.length;
