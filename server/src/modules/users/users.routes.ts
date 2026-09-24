import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { badRequest } from "../../lib/errors.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";

export const usersRouter = Router();
usersRouter.use(requireAuth, requireRole("SUPER_ADMIN"));

const select = {
  id: true, email: true, name: true, role: true, isActive: true, avatarUrl: true,
  lastLoginAt: true, createdAt: true, updatedAt: true,
  _count: { select: { articles: true } },
} as const;

usersRouter.get("/", validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof paginationQuery>(req, "query");
    const where = q.q
      ? { OR: [{ name: { contains: q.q, mode: "insensitive" as const } }, { email: { contains: q.q, mode: "insensitive" as const } }] }
      : {};
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
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).default("EDITOR"),
  isActive: z.boolean().default(true),
});

usersRouter.post("/", validate(createSchema), async (req, res, next) => {
  try {
    const { password, ...rest } = getValidated<typeof createSchema>(req);
    const user = await prisma.user.create({
      data: { ...rest, passwordHash: await bcrypt.hash(password, 12) },
      select,
    });
    logActivity(req, { action: "create", entity: "user", entityId: user.id, summary: `Tambah user ${user.email}` });
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
    if (id === req.user!.id && rest.role && rest.role !== "SUPER_ADMIN")
      throw badRequest("Tidak bisa menurunkan role akun sendiri");
    if (id === req.user!.id && rest.isActive === false) throw badRequest("Tidak bisa menonaktifkan akun sendiri");
    const user = await prisma.user.update({
      where: { id },
      data: { ...rest, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
      select,
    });
    logActivity(req, { action: "update", entity: "user", entityId: user.id, summary: `Ubah user ${user.email}` });
    res.json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id as string;
    if (id === req.user!.id) throw badRequest("Tidak bisa menghapus akun sendiri");
    const user = await prisma.user.delete({ where: { id }, select: { email: true } });
    logActivity(req, { action: "delete", entity: "user", entityId: id, summary: `Hapus user ${user.email}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
