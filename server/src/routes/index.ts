import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { activityRouter } from "../modules/activity/activity.routes.js";
import { categoriesRouter, tagsRouter, publicTaxonomyRouter } from "../modules/taxonomy/taxonomy.routes.js";
import { articlesRouter, publicArticlesRouter } from "../modules/articles/articles.routes.js";
import { pressRouter, publicPressRouter } from "../modules/press/press.routes.js";
import { socialRouter, publicSocialRouter } from "../modules/social/social.routes.js";
import { mediaRouter } from "../modules/media/media.routes.js";
import { stationsRouter, publicStationsRouter } from "../modules/stations/stations.routes.js";
import { consentRouter, publicConsentRouter } from "../modules/consent/consent.routes.js";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes.js";
import { seoRouter } from "../modules/seo/seo.routes.js";
import { hrRouter, publicCareersRouter } from "../modules/hr/hr.routes.js";
import { leadsRouter, publicLeadsRouter } from "../modules/leads/leads.routes.js";
import { env } from "../config/env.js";

export const api = Router();

// ── Admin (butuh login) ─────────────────────────────────────────────
api.use("/auth", authRouter);
api.use("/admin/users", usersRouter);
api.use("/admin/activity", activityRouter);
api.use("/admin/dashboard", dashboardRouter);
api.use("/admin/hr", hrRouter); // lowongan, divisi, lokasi, kontak HR (role HR_MANAGER/HR_STAFF)
api.use("/admin/seo", seoRouter); // audit situs + analisis draf artikel (SEO/AEO/GEO)
api.use("/admin/topics", categoriesRouter); // "Topics" in the UI (DB model: Category)
api.use("/admin/categories", categoriesRouter);
api.use("/admin/tags", tagsRouter);
api.use("/admin/articles", articlesRouter);
api.use("/admin/press", pressRouter);
api.use("/admin/social", socialRouter);
api.use("/admin/media", mediaRouter);
api.use("/admin/stations", stationsRouter);
api.use("/admin/leads", leadsRouter); // booking showroom + pesan kontak + statistik
api.use("/admin/consent", consentRouter);

// ── Publik: form submission (POST, tanpa cache) — didaftarkan SEBELUM publicRouter ──
api.use("/public/leads", publicLeadsRouter);

// ── Publik (dikonsumsi Next.js SSR/ISR) — cache-able ────────────────
const publicRouter = Router();
publicRouter.use((_req, res, next) => {
  res.setHeader("Cache-Control", `public, max-age=0, s-maxage=${env.CACHE_TTL_PUBLIC}, stale-while-revalidate=600`);
  next();
});
publicRouter.use("/articles", publicArticlesRouter);
publicRouter.use("/careers", publicCareersRouter);
publicRouter.use("/press", publicPressRouter);
publicRouter.use("/social", publicSocialRouter);
publicRouter.use("/stations", publicStationsRouter);
publicRouter.use("/", publicTaxonomyRouter);
api.use("/public", publicRouter);

// Persetujuan cookie: tulis (POST), jadi di luar publicRouter yang cache-able.
api.use("/consent", publicConsentRouter);
