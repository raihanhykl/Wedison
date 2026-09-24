import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";

export const activityRouter = Router();
usersGuard();
function usersGuard() {
  activityRouter.use(requireAuth, requireRole("ADMIN"));
}

const query = paginationQuery.extend({
  entity: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
});

activityRouter.get("/", validate(query, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof query>(req, "query");
    const where = {
      ...(q.entity ? { entity: q.entity } : {}),
      ...(q.action ? { action: q.action } : {}),
      ...(q.userId ? { userId: q.userId } : {}),
      ...(q.q ? { summary: { contains: q.q, mode: "insensitive" as const } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        ...skipTake(q),
      }),
      prisma.activityLog.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});
