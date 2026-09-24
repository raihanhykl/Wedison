import { prisma } from "./prisma.js";
import { logger } from "./logger.js";
import { invalidate, CacheTags } from "./cache.js";

/**
 * Promote SCHEDULED content whose publish time has passed to PUBLISHED.
 * Runs every minute (see startScheduler) and on demand before admin listings,
 * so the status shown in the dashboard is never stale.
 */
export async function promoteScheduled(): Promise<number> {
  const now = new Date();
  const [articles, press] = await Promise.all([
    prisma.article.updateMany({
      where: { status: "SCHEDULED", deletedAt: null, publishedAt: { lte: now } },
      data: { status: "PUBLISHED" },
    }),
    prisma.pressCoverage.updateMany({
      where: { status: "SCHEDULED", publishedAt: { lte: now } },
      data: { status: "PUBLISHED" },
    }),
  ]);
  const total = articles.count + press.count;
  if (total > 0) {
    logger.info({ articles: articles.count, press: press.count }, "scheduled content published");
    invalidate([CacheTags.articles, CacheTags.press, CacheTags.dashboard]);
  }
  return total;
}

export function startScheduler(intervalMs = 60_000) {
  const tick = () => promoteScheduled().catch((err) => logger.warn({ err }, "scheduler tick failed"));
  void tick();
  const timer = setInterval(tick, intervalMs);
  timer.unref();
  return () => clearInterval(timer);
}
