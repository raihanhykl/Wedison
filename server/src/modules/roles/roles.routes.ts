import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requirePermission } from "../../middleware/auth.js";
import { badRequest, conflict, notFound } from "../../lib/errors.js";
import { logActivity } from "../../lib/activity.js";
import { PERMISSION_CATALOG } from "../../lib/permissions.js";
import {
  ROLE_COLORS, roleSelect, roleCreateSchema, roleUpdateSchema, preparePermissions, assertKeyAllowed, assertUnique, assertNotSystem,
  assertManagersRemain, slugifyRoleKey,
} from "../../lib/roles.js";

/**
 * Custom roles (System > Users > Roles). Every route needs `users.manage`.
 * Invariants enforced here:
 *  - the system role (super_admin) is read-only and undeletable
 *  - key is immutable and unique (case-insensitive), name unique (case-insensitive)
 *  - permissions are validated against the catalog and implied permissions are added
 *  - a role with members cannot be deleted
 *  - no change may leave zero active users who can manage users & roles
 */
export const rolesRouter = Router();
rolesRouter.use(requireAuth, requirePermission("users.manage", "Only users with the Manage users & roles permission can do this"));

rolesRouter.get("/catalog", (_req, res) => {
  res.json({ ok: true, data: { modules: PERMISSION_CATALOG, colors: ROLE_COLORS } });
});

rolesRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.role.findMany({ select: roleSelect, orderBy: [{ isSystem: "desc" }, { name: "asc" }] });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

rolesRouter.get("/:id", async (req, res, next) => {
  try {
    const role = await prisma.role.findUnique({ where: { id: req.params.id as string }, select: roleSelect });
    if (!role) throw notFound("Role not found");
    res.json({ ok: true, data: role });
  } catch (e) {
    next(e);
  }
});

rolesRouter.post("/", validate(roleCreateSchema), async (req, res, next) => {
  try {
    const body = getValidated<typeof roleCreateSchema>(req);
    const key = body.key ?? slugifyRoleKey(body.name);
    assertKeyAllowed(key);
    await assertUnique({ name: body.name, key });
    const permissions = preparePermissions(body.permissions);
    const role = await prisma.role.create({
      data: { key, name: body.name, description: body.description ?? null, color: body.color ?? null, permissions },
      select: roleSelect,
    });
    logActivity(req, { action: "create", entity: "role", entityId: role.id, summary: `Created role ${role.name}`, meta: { permissions } });
    res.status(201).json({ ok: true, data: role });
  } catch (e) {
    next(e);
  }
});

rolesRouter.patch("/:id", validate(roleUpdateSchema), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const body = getValidated<typeof roleUpdateSchema>(req);
    const existing = await prisma.role.findUnique({ where: { id }, select: roleSelect });
    if (!existing) throw notFound("Role not found");
    assertNotSystem(existing);
    if (body.key !== undefined && body.key !== existing.key) throw badRequest("The role key cannot be changed after creation");
    if (body.name !== undefined) await assertUnique({ name: body.name, exceptId: id });
    const permissions = body.permissions !== undefined ? preparePermissions(body.permissions) : undefined;

    const role = await prisma.$transaction(async (tx) => {
      const updated = await tx.role.update({
        where: { id },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.color !== undefined ? { color: body.color } : {}),
          ...(permissions ? { permissions } : {}),
        },
        select: roleSelect,
      });
      if (permissions) await assertManagersRemain(tx);
      return updated;
    });
    const removed = permissions ? existing.permissions.filter((p) => !permissions.includes(p)) : [];
    const added = permissions ? permissions.filter((p) => !existing.permissions.includes(p)) : [];
    logActivity(req, { action: "update", entity: "role", entityId: id, summary: `Updated role ${role.name}`, meta: { added, removed } });
    res.json({ ok: true, data: role });
  } catch (e) {
    next(e);
  }
});

const duplicateSchema = z.object({ name: z.string().trim().min(2).max(60).optional() });

rolesRouter.post("/:id/duplicate", validate(duplicateSchema), async (req, res, next) => {
  try {
    const src = await prisma.role.findUnique({ where: { id: req.params.id as string }, select: roleSelect });
    if (!src) throw notFound("Role not found");
    const { name: wanted } = getValidated<typeof duplicateSchema>(req);
    // Super Admin can be duplicated as a normal role with every catalog permission (not "*").
    const permissions = preparePermissions(src.isSystem ? PERMISSION_CATALOG.flatMap((m) => m.permissions.map((p) => p.key)) : src.permissions);
    let name = wanted ?? `${src.name} (copy)`;
    let key = slugifyRoleKey(name) || `${src.key}_copy`;
    for (let i = 2; i < 50; i++) {
      const clash = await prisma.role.findFirst({ where: { OR: [{ name: { equals: name, mode: "insensitive" } }, { key }] }, select: { id: true } });
      if (!clash) break;
      if (wanted) throw conflict(`A role named "${wanted}" already exists`);
      name = `${src.name} (copy ${i})`;
      key = slugifyRoleKey(name);
    }
    assertKeyAllowed(key);
    const role = await prisma.role.create({ data: { key, name, description: src.description, color: src.color, permissions }, select: roleSelect });
    logActivity(req, { action: "create", entity: "role", entityId: role.id, summary: `Duplicated role ${src.name} as ${role.name}` });
    res.status(201).json({ ok: true, data: role });
  } catch (e) {
    next(e);
  }
});

rolesRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const role = await prisma.role.findUnique({ where: { id }, select: roleSelect });
    if (!role) throw notFound("Role not found");
    assertNotSystem(role, "deleted");
    if (role._count.users > 0) throw conflict(`${role.name} still has ${role._count.users} member${role._count.users > 1 ? "s" : ""}. Move them to another role first.`);
    await prisma.role.delete({ where: { id } });
    logActivity(req, { action: "delete", entity: "role", entityId: id, summary: `Deleted role ${role.name}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
