import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, requireModule } from "../../middleware/auth.js";
import { cached, CacheTags, cacheStats } from "../../lib/cache.js";
import { canAccess, has, type Module } from "../../lib/permissions.js";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth, requireModule("dashboard"));

dashboardRouter.get("/stats", async (req, res, next) => {
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
            include: { user: { select: { name: true, avatarUrl: true, deletedAt: true } } },
          }),
          prisma.article.aggregate({ _sum: { viewCount: true }, where: { deletedAt: null } }),
        ]);
      const publishedLast30 = await prisma.article.count({ where: { deletedAt: null, status: "PUBLISHED", publishedAt: { gte: since } } });
      const now = new Date();
      const [bookings, bookingsNew, bookingsUpcoming7d, contactsUnhandled] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "NEW" } }),
        prisma.booking.count({ where: { startAt: { gte: now, lt: new Date(now.getTime() + 7 * 86_400_000) }, status: { notIn: ["CANCELLED", "NO_SHOW"] } } }),
        prisma.contactSubmission.count({ where: { isHandled: false } }),
      ]);
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
          bookings,
          bookingsNew,
          bookingsUpcoming7d,
          contactsUnhandled,
        },
        recentArticles,
        recentActivity,
        cache: cacheStats(),
        generatedAt: new Date().toISOString(),
      };
    }, 60);
    const u = req.user!;
    const c = data.counts;
    const cms = canAccess(u, "cms");
    const leads = canAccess(u, "leads");
    const sc = canAccess(u, "supercharge");
    res.json({
      ok: true,
      data: {
        ...data,
        counts: {
          ...c,
          ...(cms ? {} : { articles: 0, articlesByStatus: {}, publishedLast30Days: 0, totalViews: 0, press: 0, social: 0, media: 0 }),
          ...(leads ? {} : { bookings: 0, bookingsNew: 0, bookingsUpcoming7d: 0, contactsUnhandled: 0 }),
          ...(sc ? {} : { stations: 0, stationsByStatus: {} }),
        },
        recentArticles: cms ? data.recentArticles : [],
        // The activity feed mirrors the Activity Log, so it follows the same permission.
        recentActivity: has(u, "activity.view") ? data.recentActivity : [],
        access: { cms, leads, supercharge: sc, activity: has(u, "activity.view") },
      },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * Module cards for the dashboard: a few headline numbers for every module the signed-in user
 * can open (and nothing for the others). Each module is computed only when accessible.
 */
type Stat = { label: string; value: number; href?: string; tone?: "attention" };
type ModuleSummary = { module: Module; stats: Stat[] };

dashboardRouter.get("/modules", async (req, res, next) => {
  try {
    const u = req.user!;
    const now = new Date();
    const in7 = new Date(now.getTime() + 7 * 86_400_000);
    const since24h = new Date(now.getTime() - 86_400_000);
    const tasks: Partial<Record<Module, () => Promise<Stat[]>>> = {
      cms: async () => {
        const [byStatus, press, social, media] = await Promise.all([
          prisma.article.groupBy({ by: ["status"], where: { deletedAt: null }, _count: true }),
          prisma.pressCoverage.count({ where: { status: "PUBLISHED" } }),
          prisma.socialPost.count({ where: { isActive: true } }),
          prisma.media.count(),
        ]);
        const a = Object.fromEntries(byStatus.map((x) => [x.status, x._count]));
        return [
          { label: "Published", value: a.PUBLISHED ?? 0, href: "/admin/cms/articles" },
          { label: "Drafts", value: a.DRAFT ?? 0, href: "/admin/cms/articles" },
          { label: "Scheduled", value: a.SCHEDULED ?? 0, href: "/admin/cms/articles" },
          { label: "Press · social", value: press + social, href: "/admin/cms/press" },
          { label: "Media files", value: media, href: "/admin/cms/media" },
        ];
      },
      supercharge: async () => {
        const g = await prisma.station.groupBy({ by: ["status"], where: { isActive: true }, _count: true });
        const m = Object.fromEntries(g.map((x) => [x.status, x._count]));
        return [
          { label: "Operational", value: m.OPERATIONAL ?? 0, href: "/admin/supercharge/stations" },
          { label: "Coming soon", value: m.COMING_SOON ?? 0, href: "/admin/supercharge/stations" },
          { label: "Maintenance", value: m.MAINTENANCE ?? 0, href: "/admin/supercharge/stations", tone: (m.MAINTENANCE ?? 0) > 0 ? "attention" : undefined },
        ];
      },
      pricing: async () => {
        const [regions, schemes, rows] = await Promise.all([
          prisma.priceRegion.count({ where: { isActive: true } }),
          prisma.pricingScheme.count({ where: { isActive: true, isPublic: true } }),
          prisma.priceEntry.count({ where: { isActive: true } }),
        ]);
        return [
          { label: "Active regions", value: regions, href: "/admin/pricing" },
          { label: "Public schemes", value: schemes, href: "/admin/pricing" },
          { label: "Price rows", value: rows, href: "/admin/pricing" },
        ];
      },
      leads: async () => {
        const [newB, upcoming, unhandled] = await Promise.all([
          prisma.booking.count({ where: { status: "NEW" } }),
          prisma.booking.count({ where: { startAt: { gte: now, lt: in7 }, status: { notIn: ["CANCELLED", "NO_SHOW"] } } }),
          prisma.contactSubmission.count({ where: { isHandled: false } }),
        ]);
        return [
          { label: "New bookings", value: newB, href: "/admin/leads/bookings?status=NEW", tone: newB > 0 ? "attention" : undefined },
          { label: "Visits in 7 days", value: upcoming, href: "/admin/leads/bookings?upcoming=1" },
          { label: "Unread messages", value: unhandled, href: "/admin/leads/contacts", tone: unhandled > 0 ? "attention" : undefined },
        ];
      },
      showrooms: async () => {
        const g = await prisma.showroom.groupBy({ by: ["status"], _count: true });
        const m = Object.fromEntries(g.map((x) => [x.status, x._count]));
        return [
          { label: "Open", value: m.OPEN ?? 0, href: "/admin/showrooms" },
          { label: "Coming soon", value: m.COMING_SOON ?? 0, href: "/admin/showrooms" },
        ];
      },
      teasers: async () => {
        const g = await prisma.showroomTeaser.groupBy({ by: ["status"], _count: true });
        const m = Object.fromEntries(g.map((x) => [x.status, x._count]));
        return [
          { label: "Live teasers", value: m.PUBLISHED ?? 0, href: "/admin/teasers" },
          { label: "Teaser drafts", value: m.DRAFT ?? 0, href: "/admin/teasers" },
        ];
      },
      hr: async () => {
        const [g, closing] = await Promise.all([
          prisma.job.groupBy({ by: ["status"], _count: true }),
          prisma.job.count({ where: { status: "PUBLISHED", closesAt: { gte: now, lte: in7 } } }),
        ]);
        const m = Object.fromEntries(g.map((x) => [x.status, x._count]));
        return [
          { label: "Live openings", value: m.PUBLISHED ?? 0, href: "/admin/hr/jobs?status=PUBLISHED" },
          { label: "To review", value: m.PENDING_REVIEW ?? 0, href: "/admin/hr/jobs?status=PENDING_REVIEW", tone: (m.PENDING_REVIEW ?? 0) > 0 ? "attention" : undefined },
          { label: "Closing in 7 days", value: closing, href: "/admin/hr" },
        ];
      },
      users: async () => {
        const [active, inactive, roles] = await Promise.all([
          prisma.user.count({ where: { deletedAt: null, isActive: true } }),
          prisma.user.count({ where: { deletedAt: null, isActive: false } }),
          prisma.role.count(),
        ]);
        return [
          { label: "Active users", value: active, href: "/admin/users" },
          { label: "Inactive", value: inactive, href: "/admin/users" },
          { label: "Roles", value: roles, href: "/admin/users?tab=roles" },
        ];
      },
      activity: async () => [{ label: "Actions in 24 h", value: await prisma.activityLog.count({ where: { createdAt: { gte: since24h } } }), href: "/admin/activity" }],
    };
    const allowed = (Object.keys(tasks) as Module[]).filter((m) => canAccess(u, m));
    const results = await Promise.all(allowed.map(async (m): Promise<ModuleSummary> => ({ module: m, stats: await tasks[m]!() })));
    res.json({ ok: true, data: { modules: results, canWriteArticles: has(u, "cms.write") } });
  } catch (e) {
    next(e);
  }
});
