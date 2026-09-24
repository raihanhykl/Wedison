import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { cached, CacheTags, cacheStats } from "../../lib/cache.js";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

dashboardRouter.get("/stats", async (_req, res, next) => {
  try {
    const data = await cached("admin:dashboard:stats", [CacheTags.dashboard], async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
      const [articles, byStatus, press, social, media, stations, stationsByStatus, recentArticles, recentActivity, views] =
        await Promise.all([
          prisma.article.count({ where: { deletedAt: null } }),
          prisma.article.groupBy({ by: ["status"], where: { deletedAt: null }, _count: true }),
          prisma.pressCoverage.count({ where: { status: "PUBLISHED" } }),
          prisma.socialPost.count({ where: { isActive: true } }),
          prisma.media.count(),
          prisma.station.count({ where: { isActive: true } }),
          prisma.station.groupBy({ by: ["status"], where: { isActive: true }, _count: true }),
          prisma.article.findMany({
            where: { deletedAt: null },
            orderBy: { updatedAt: "desc" },
            take: 6,
            include: { translations: { select: { locale: true, title: true, slug: true } }, author: { select: { name: true } } },
          }),
          prisma.activityLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { user: { select: { name: true, avatarUrl: true } } },
          }),
          prisma.article.aggregate({ _sum: { viewCount: true }, where: { deletedAt: null } }),
        ]);
      const publishedLast30 = await prisma.article.count({ where: { deletedAt: null, status: "PUBLISHED", publishedAt: { gte: since } } });
      return {
        counts: {
          articles,
          articlesByStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
          publishedLast30Days: publishedLast30,
          totalViews: views._sum.viewCount ?? 0,
          press,
          social,
          media,
          stations,
          stationsByStatus: Object.fromEntries(stationsByStatus.map((s) => [s.status, s._count])),
        },
        recentArticles,
        recentActivity,
        cache: cacheStats(),
        generatedAt: new Date().toISOString(),
      };
    }, 60);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});
