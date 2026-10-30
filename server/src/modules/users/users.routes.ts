import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requirePermission } from "../../middleware/auth.js";
import { badRequest, conflict, HttpError, notFound } from "../../lib/errors.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { assertManagersRemain } from "../../lib/roles.js";

/**
 * Users. Deleting is a SOFT delete: the account can no longer sign in and is hidden from the
 * default list, but the row (name, email, role) stays so every createdBy / updatedBy, article
 * author and activity-log entry keeps pointing at a real person. Deleted users can be restored.
 */
export const usersRouter = Router();
usersRouter.use(requireAuth, requirePermission("users.manage", "Only users with the Manage users & roles permission can do this"));

const select = {
  id: true, email: true, name: true, isActive: true, avatarUrl: true,
  lastLoginAt: true, createdAt: true, updatedAt: true, createdById: true, updatedById: true,
  deletedAt: true, deletedById: true,
  role: { select: { id: true, key: true, name: true, color: true, isSystem: true } },
  _count: { select: { articles: true } },
} as const;

const STATUS = z.enum(["active", "inactive", "deleted", "all"]);
const listQuery = paginationQuery.extend({
  roleId: z.string().optional(),
  /** active | inactive | deleted | all (default: active + inactive, i.e. not deleted) */
  status: STATUS.optional(),
  /** @deprecated use status */
  active: z.enum(["true", "false"]).optional(),
});

usersRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const status = q.status ?? (q.active === "true" ? "active" : q.active === "false" ? "inactive" : undefined);
    const where = {
      ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" as const } }, { email: { contains: q.q, mode: "insensitive" as const } }] } : {}),
      ...(q.roleId ? { roleId: q.roleId } : {}),
      ...(status === "deleted" ? { deletedAt: { not: null } } : status === "all" ? {} : { deletedAt: null }),
      ...(status === "active" ? { isActive: true } : status === "inactive" ? { isActive: false } : {}),
    };
    const [items, total, deletedCount] = await Promise.all([
      prisma.user.findMany({ where, select, orderBy: status === "deleted" ? { deletedAt: "desc" } : { createdAt: "desc" }, ...skipTake(q) }),
      prisma.user.count({ where }),
      prisma.user.count({ where: { deletedAt: { not: null } } }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q), deletedCount });
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  name: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(128),
  roleId: z.string().min(1, "Role is required"),
  isActive: z.boolean().default(true),
});

async function assertRoleExists(roleId: string) {
  const role = await prisma.role.findUnique({ where: { id: roleId }, select: { id: true, name: true } });
  if (!role) throw badRequest("The selected role does not exist");
  return role;
}

/** Email already used: by a live user (400) or by a deleted one (409 with its id, so the UI can offer Restore). */
async function assertEmailFree(email: string, exceptId?: string) {
  const clash = await prisma.user.findUnique({ where: { email }, select: { id: true, deletedAt: true, name: true } });
  if (!clash || clash.id === exceptId) return;
  if (clash.deletedAt) throw new HttpError(409, `${email} belongs to a deleted user (${clash.name}). Restore that account instead.`, "USER_DELETED", { userId: clash.id });
  throw badRequest("A user with this email already exists");
}

usersRouter.post("/", validate(createSchema), async (req, res, next) => {
  try {
    const { password, ...rest } = getValidated<typeof createSchema>(req);
    await assertRoleExists(rest.roleId);
    await assertEmailFree(rest.email);
    const user = await prisma.user.create({
      data: { ...rest, passwordHash: await bcrypt.hash(password, 12) },
      select,
    });
    logActivity(req, { action: "create", entity: "user", entityId: user.id, summary: `Added user ${user.email} (${user.role?.name ?? "no role"})` });
    res.status(201).json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});

const updateSchema = createSchema.partial().extend({ password: z.string().min(8).max(128).optional() });

async function findLive(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select });
  if (!user) throw notFound("User not found");
  if (user.deletedAt) throw notFound("This user was deleted. Restore the account to change it.");
  return user;
}

usersRouter.patch("/:id", validate(updateSchema), async (req, res, next) => {
  try {
    const { password, ...rest } = getValidated<typeof updateSchema>(req);
    const id = req.params.id as string;
    const me = req.user!.id;
    const before = await findLive(id);
    if (id === me && rest.roleId && rest.roleId !== before.role?.id) throw badRequest("You cannot change your own role. Ask another administrator.");
    if (id === me && rest.isActive === false) throw badRequest("You cannot deactivate your own account");
    if (rest.roleId) await assertRoleExists(rest.roleId);
    if (rest.email && rest.email !== before.email) await assertEmailFree(rest.email, id);
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id },
        data: { ...rest, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
        select,
      });
      if (rest.roleId !== undefined || rest.isActive !== undefined) await assertManagersRemain(tx);
      return u;
    });
    const roleChanged = before.role?.id !== user.role?.id ? ` · role ${before.role?.name ?? "none"} → ${user.role?.name ?? "none"}` : "";
    logActivity(req, { action: "update", entity: "user", entityId: user.id, summary: `Updated user ${user.email}${roleChanged}` });
    res.json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id as string;
    if (id === req.user!.id) throw badRequest("You cannot delete your own account");
    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true, deletedAt: true } });
    if (!existing) throw notFound("User not found");
    if (existing.deletedAt) throw conflict("This user is already deleted");
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id },
        data: { deletedAt: new Date(), deletedById: req.user!.id, isActive: false },
        select,
      });
      await assertManagersRemain(tx);
      return u;
    });
    logActivity(req, { action: "delete", entity: "user", entityId: id, summary: `Deleted user ${user.email} (${user.role?.name ?? "no role"})` });
    res.json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});

const restoreSchema = z.object({
  /** Required when the user's old role no longer exists. */
  roleId: z.string().min(1).optional(),
  isActive: z.boolean().default(true),
});

usersRouter.post("/:id/restore", validate(restoreSchema), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const body = getValidated<typeof restoreSchema>(req);
    const existing = await prisma.user.findUnique({ where: { id }, select });
    if (!existing) throw notFound("User not found");
    if (!existing.deletedAt) throw conflict("This user is not deleted");
    const roleId = body.roleId ?? existing.role?.id;
    if (!roleId) throw badRequest("The user's previous role was deleted. Choose a role to restore the account.");
    await assertRoleExists(roleId);
    const user = await prisma.user.update({
      where: { id },
      data: { deletedAt: null, deletedById: null, isActive: body.isActive, roleId },
      select,
    });
    logActivity(req, { action: "restore", entity: "user", entityId: id, summary: `Restored user ${user.email} (${user.role?.name})` });
    res.json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});
