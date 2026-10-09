import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requirePermission } from "../../middleware/auth.js";
import { badRequest, notFound } from "../../lib/errors.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { assertManagersRemain } from "../../lib/roles.js";

export const usersRouter = Router();
usersRouter.use(requireAuth, requirePermission("users.manage", "Only users with the Manage users & roles permission can do this"));

const select = {
  id: true, email: true, name: true, isActive: true, avatarUrl: true,
  lastLoginAt: true, createdAt: true, updatedAt: true,
  role: { select: { id: true, key: true, name: true, color: true, isSystem: true } },
  _count: { select: { articles: true } },
} as const;

const listQuery = paginationQuery.extend({ roleId: z.string().optional(), active: z.enum(["true", "false"]).optional() });

usersRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const where = {
      ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" as const } }, { email: { contains: q.q, mode: "insensitive" as const } }] } : {}),
      ...(q.roleId ? { roleId: q.roleId } : {}),
      ...(q.active ? { isActive: q.active === "true" } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, select, orderBy: { createdAt: "desc" }, ...skipTake(q) }),
      prisma.user.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
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

usersRouter.post("/", validate(createSchema), async (req, res, next) => {
  try {
    const { password, ...rest } = getValidated<typeof createSchema>(req);
    await assertRoleExists(rest.roleId);
    const exists = await prisma.user.findUnique({ where: { email: rest.email }, select: { id: true } });
    if (exists) throw badRequest("A user with this email already exists");
    const user = await prisma.user.create({
      data: { ...rest, passwordHash: await bcrypt.hash(password, 12) },
      select,
    });
    logActivity(req, { action: "create", entity: "user", entityId: user.id, summary: `Added user ${user.email} (${user.role.name})` });
    res.status(201).json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});

const updateSchema = createSchema.partial().extend({ password: z.string().min(8).max(128).optional() });

usersRouter.patch("/:id", validate(updateSchema), async (req, res, next) => {
  try {
    const { password, ...rest } = getValidated<typeof updateSchema>(req);
    const id = req.params.id as string;
    const me = req.user!.id;
    const before = await prisma.user.findUnique({ where: { id }, select });
    if (!before) throw notFound("User not found");
    if (id === me && rest.roleId && rest.roleId !== before.role.id) throw badRequest("You cannot change your own role. Ask another administrator.");
    if (id === me && rest.isActive === false) throw badRequest("You cannot deactivate your own account");
    if (rest.roleId) await assertRoleExists(rest.roleId);
    if (rest.email && rest.email !== before.email) {
      const clash = await prisma.user.findUnique({ where: { email: rest.email }, select: { id: true } });
      if (clash) throw badRequest("A user with this email already exists");
    }
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id },
        data: { ...rest, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
        select,
      });
      if (rest.roleId !== undefined || rest.isActive !== undefined) await assertManagersRemain(tx);
      return u;
    });
    const roleChanged = before.role.id !== user.role.id ? ` · role ${before.role.name} → ${user.role.name}` : "";
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
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.delete({ where: { id }, select: { email: true } });
      await assertManagersRemain(tx);
      return u;
    });
    logActivity(req, { action: "delete", entity: "user", entityId: id, summary: `Deleted user ${user.email}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
