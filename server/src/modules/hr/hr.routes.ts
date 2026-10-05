import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireModule, requireHr } from "../../middleware/auth.js";
import { canHr } from "../../lib/permissions.js";
import { slugify, uniqueSlug } from "../../lib/slug.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { badRequest, forbidden, notFound } from "../../lib/errors.js";
import { getHrSettings, hrSettingsSchema, saveHrSettings } from "./hr.settings.js";

// ─── Schemas ────────────────────────────────────────────────────────────────
const STATUS = z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "CLOSED", "ARCHIVED"]);
const EMPLOYMENT = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]);
const WORKPLACE = z.enum(["ONSITE", "HYBRID", "REMOTE"]);
const LEVEL = z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "MANAGER"]);
const LOCALE = z.enum(["id", "en"]);

const lines = z.array(z.string().trim().min(1).max(400)).max(30).default([]);
const translationSchema = z.object({
  locale: LOCALE,
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters").max(2000),
  responsibilities: lines,
  qualifications: lines,
  niceToHave: lines,
  benefits: lines,
});

const jobSchema = z
  .object({
    slug: z.string().trim().max(120).optional(),
    departmentId: z.string().nullable().optional(),
    locationIds: z.array(z.string()).max(20).default([]),
    employmentType: EMPLOYMENT.default("FULL_TIME"),
    workplaceType: WORKPLACE.default("ONSITE"),
    experienceLevel: LEVEL.nullable().optional(),
    openings: z.coerce.number().int().min(1).max(999).default(1),
    salaryMin: z.coerce.number().int().min(0).nullable().optional(),
    salaryMax: z.coerce.number().int().min(0).nullable().optional(),
    salaryCurrency: z.string().trim().length(3).default("IDR"),
    showSalary: z.boolean().default(false),
    isUrgent: z.boolean().default(false),
    applyEmail: z.string().trim().email().nullable().optional().or(z.literal("").transform(() => null)),
    portals: z.array(z.object({ name: z.string().trim().min(1).max(40), url: z.string().trim().url().max(500) })).max(10).default([]),
    closesAt: z.coerce.date().nullable().optional(),
    sortOrder: z.coerce.number().int().default(0),
    translations: z.array(translationSchema).min(1, "Write the job in at least one language"),
  })
  .refine((v) => new Set(v.translations.map((t) => t.locale)).size === v.translations.length, { message: "Duplicate language", path: ["translations"] })
  .refine((v) => v.salaryMin == null || v.salaryMax == null || v.salaryMax >= v.salaryMin, { message: "Maximum salary must be greater than or equal to minimum", path: ["salaryMax"] });

const include = {
  department: true,
  locations: { orderBy: { sortOrder: "asc" } },
  translations: true,
  _count: { select: { applyClicks: true } },
} satisfies Prisma.JobInclude;

type JobWithRel = Prisma.JobGetPayload<{ include: typeof include }>;

async function uniqueJobSlug(base: string, id?: string) {
  return uniqueSlug(base, async (s) => {
    const f = await prisma.job.findUnique({ where: { slug: s }, select: { id: true } });
    return !!f && f.id !== id;
  });
}

function titleOf(j: { translations: { locale: string; title: string }[] }) {
  return (j.translations.find((t) => t.locale === "id") ?? j.translations[0])?.title ?? "(untitled)";
}

function bust() {
  invalidate([CacheTags.jobs]);
}

/** Close published jobs whose closing date has passed. Called by the scheduler and before listings. */
export async function autoCloseJobs(): Promise<number> {
  const now = new Date();
  const r = await prisma.job.updateMany({
    where: { status: "PUBLISHED", closesAt: { lte: now } },
    data: { status: "CLOSED", closedAt: now },
  });
  if (r.count) bust();
  return r.count;
}

// ─── Admin router ───────────────────────────────────────────────────────────
export const hrRouter = Router();
hrRouter.use(requireAuth, requireModule("hr"));

// Who am I in HR (permissions for the UI)
hrRouter.get("/permissions", (req, res) => {
  const r = req.user!.role;
  res.json({
    ok: true,
    data: {
      role: r,
      write: canHr(r, "jobs.write"),
      publish: canHr(r, "jobs.publish"),
      delete: canHr(r, "jobs.delete"),
      settings: canHr(r, "settings.write"),
      taxonomy: canHr(r, "taxonomy.write"),
    },
  });
});

// Overview metrics
hrRouter.get("/overview", requireHr("jobs.read"), async (_req, res, next) => {
  try {
    await autoCloseJobs();
    const now = new Date();
    const in7 = new Date(now.getTime() + 7 * 86400000);
    const since30 = new Date(now.getTime() - 30 * 86400000);
    const [byStatus, closingSoon, openings, views, clicks30, byChannel, byDept, top] = await Promise.all([
      prisma.job.groupBy({ by: ["status"], _count: true }),
      prisma.job.findMany({
        where: { status: "PUBLISHED", closesAt: { gte: now, lte: in7 } },
        select: { id: true, closesAt: true, translations: { select: { locale: true, title: true } } },
        orderBy: { closesAt: "asc" },
        take: 10,
      }),
      prisma.job.aggregate({ where: { status: "PUBLISHED" }, _sum: { openings: true } }),
      prisma.job.aggregate({ where: { status: "PUBLISHED" }, _sum: { viewCount: true } }),
      prisma.jobApplyClick.count({ where: { createdAt: { gte: since30 } } }),
      prisma.jobApplyClick.groupBy({ by: ["channel"], where: { createdAt: { gte: since30 } }, _count: true }),
      prisma.job.groupBy({ by: ["departmentId"], where: { status: "PUBLISHED" }, _count: true }),
      prisma.job.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, viewCount: true, translations: { select: { locale: true, title: true } }, _count: { select: { applyClicks: true } } },
        orderBy: { viewCount: "desc" },
        take: 6,
      }),
    ]);
    const depts = await prisma.jobDepartment.findMany({ where: { id: { in: byDept.map((d) => d.departmentId).filter((x): x is string => !!x) } } });
    const pending = await prisma.job.findMany({
      where: { status: "PENDING_REVIEW" },
      select: { id: true, updatedAt: true, translations: { select: { locale: true, title: true } } },
      orderBy: { updatedAt: "asc" },
      take: 10,
    });
    res.json({
      ok: true,
      data: {
        counts: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        openPositions: openings._sum.openings ?? 0,
        totalViews: views._sum.viewCount ?? 0,
        applyClicks30d: clicks30,
        clicksByChannel30d: byChannel.map((c) => ({ channel: c.channel, count: c._count })).sort((a, b) => b.count - a.count),
        byDepartment: byDept.map((d) => ({ name: depts.find((x) => x.id === d.departmentId)?.nameId ?? "No division", count: d._count })).sort((a, b) => b.count - a.count),
        closingSoon: closingSoon.map((j) => ({ id: j.id, title: titleOf(j), closesAt: j.closesAt })),
        pendingReview: pending.map((j) => ({ id: j.id, title: titleOf(j), updatedAt: j.updatedAt })),
        topJobs: top.map((j) => ({ id: j.id, title: titleOf(j), views: j.viewCount, applyClicks: j._count.applyClicks })),
      },
    });
  } catch (e) {
    next(e);
  }
});

// ── Jobs ──
const listQuery = paginationQuery.extend({
  status: STATUS.optional(),
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  employmentType: EMPLOYMENT.optional(),
});

hrRouter.get("/jobs", requireHr("jobs.read"), validate(listQuery, "query"), async (req, res, next) => {
  try {
    await autoCloseJobs();
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.JobWhereInput = {
      ...(q.status ? { status: q.status } : { status: { not: "ARCHIVED" } }),
      ...(q.departmentId ? { departmentId: q.departmentId } : {}),
      ...(q.locationId ? { locations: { some: { id: q.locationId } } } : {}),
      ...(q.employmentType ? { employmentType: q.employmentType } : {}),
      ...(q.q ? { translations: { some: { title: { contains: q.q, mode: "insensitive" } } } } : {}),
    };
    const [items, total, counts] = await Promise.all([
      prisma.job.findMany({ where, include, orderBy: [{ status: "asc" }, { updatedAt: "desc" }], ...skipTake(q) }),
      prisma.job.count({ where }),
      prisma.job.groupBy({ by: ["status"], _count: true }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q), counts: Object.fromEntries(counts.map((c) => [c.status, c._count])) });
  } catch (e) {
    next(e);
  }
});

hrRouter.get("/jobs/:id", requireHr("jobs.read"), async (req, res, next) => {
  try {
    const item = await prisma.job.findUnique({ where: { id: req.params.id as string }, include });
    if (!item) throw notFound("Job not found");
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

function jobData(d: z.infer<typeof jobSchema>) {
  return {
    departmentId: d.departmentId ?? null,
    employmentType: d.employmentType,
    workplaceType: d.workplaceType,
    experienceLevel: d.experienceLevel ?? null,
    openings: d.openings,
    salaryMin: d.salaryMin ?? null,
    salaryMax: d.salaryMax ?? null,
    salaryCurrency: d.salaryCurrency.toUpperCase(),
    showSalary: d.showSalary,
    isUrgent: d.isUrgent,
    applyEmail: d.applyEmail ?? null,
    portals: d.portals as Prisma.InputJsonValue,
    closesAt: d.closesAt ?? null,
    sortOrder: d.sortOrder,
  };
}

hrRouter.post("/jobs", requireHr("jobs.write"), validate(jobSchema), async (req, res, next) => {
  try {
    const d = getValidated<typeof jobSchema>(req);
    const idT = d.translations.find((t) => t.locale === "id") ?? d.translations[0];
    const slug = await uniqueJobSlug(d.slug || (d.translations.find((t) => t.locale === "en") ?? idT).title);
    const item = await prisma.job.create({
      data: {
        ...jobData(d),
        slug,
        status: "DRAFT",
        createdById: req.user!.id,
        updatedById: req.user!.id,
        locations: { connect: d.locationIds.map((id) => ({ id })) },
        translations: { create: d.translations },
      },
      include,
    });
    logActivity(req, { action: "create", entity: "job", entityId: item.id, summary: `Created job "${idT.title}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

hrRouter.put("/jobs/:id", requireHr("jobs.write"), validate(jobSchema), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const d = getValidated<typeof jobSchema>(req);
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) throw notFound("Job not found");
    // HR_STAFF cannot change a job that is already live; a manager must do it.
    if (["PUBLISHED", "CLOSED"].includes(existing.status) && !canHr(req.user!.role, "jobs.publish"))
      throw forbidden("Only an HR manager can edit a published or closed job");
    const slug = d.slug && slugify(d.slug) !== existing.slug ? await uniqueJobSlug(d.slug, id) : existing.slug;
    const locales = d.translations.map((t) => t.locale);
    const item = await prisma.$transaction(async (tx) => {
      await tx.jobTranslation.deleteMany({ where: { jobId: id, locale: { notIn: locales } } });
      for (const t of d.translations) {
        await tx.jobTranslation.upsert({ where: { jobId_locale: { jobId: id, locale: t.locale } }, update: t, create: { ...t, jobId: id } });
      }
      return tx.job.update({
        where: { id },
        data: { ...jobData(d), slug, updatedById: req.user!.id, locations: { set: d.locationIds.map((lid) => ({ id: lid })) } },
        include,
      });
    });
    if (item.status === "PUBLISHED") bust();
    logActivity(req, { action: "update", entity: "job", entityId: id, summary: `Updated job "${titleOf(item)}"` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

// Workflow transitions
const transitionSchema = z.object({
  action: z.enum(["submit", "return", "publish", "close", "reopen", "archive", "unarchive"]),
  note: z.string().trim().max(1000).optional(),
});

hrRouter.post("/jobs/:id/transition", requireHr("jobs.write"), validate(transitionSchema), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { action, note } = getValidated<typeof transitionSchema>(req);
    const job = await prisma.job.findUnique({ where: { id }, include });
    if (!job) throw notFound("Job not found");
    const role = req.user!.role;
    const needPublish = action !== "submit";
    if (needPublish && !canHr(role, "jobs.publish")) throw forbidden("Only an HR manager can do this");

    const now = new Date();
    let data: Prisma.JobUpdateInput;
    switch (action) {
      case "submit":
        if (job.status !== "DRAFT") throw badRequest("Only drafts can be submitted for review");
        data = { status: "PENDING_REVIEW", reviewNote: null };
        break;
      case "return":
        if (job.status !== "PENDING_REVIEW") throw badRequest("Only jobs pending review can be returned");
        data = { status: "DRAFT", reviewNote: note || "Returned for revision" };
        break;
      case "publish":
        if (!["DRAFT", "PENDING_REVIEW"].includes(job.status)) throw badRequest("Only drafts or pending jobs can be published");
        if (job.closesAt && job.closesAt <= now) throw badRequest("The closing date is in the past. Update it before publishing.");
        if (!job.translations.some((t) => t.responsibilities.length && t.qualifications.length))
          throw badRequest("Add at least one responsibility and one qualification before publishing");
        if (!job.locations.length) throw badRequest("Choose at least one location before publishing");
        data = { status: "PUBLISHED", publishedAt: job.publishedAt ?? now, closedAt: null, reviewNote: null };
        break;
      case "close":
        if (job.status !== "PUBLISHED") throw badRequest("Only published jobs can be closed");
        data = { status: "CLOSED", closedAt: now };
        break;
      case "reopen":
        if (job.status !== "CLOSED") throw badRequest("Only closed jobs can be reopened");
        if (job.closesAt && job.closesAt <= now) data = { status: "PUBLISHED", closedAt: null, closesAt: null };
        else data = { status: "PUBLISHED", closedAt: null };
        break;
      case "archive":
        data = { status: "ARCHIVED" };
        break;
      case "unarchive":
        if (job.status !== "ARCHIVED") throw badRequest("Job is not archived");
        data = { status: "DRAFT" };
        break;
    }
    const item = await prisma.job.update({ where: { id }, data: { ...data, updatedById: req.user!.id }, include });
    bust();
    logActivity(req, { action, entity: "job", entityId: id, summary: `${action} job "${titleOf(item)}"${note ? ` — ${note}` : ""}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

hrRouter.post("/jobs/:id/duplicate", requireHr("jobs.write"), async (req, res, next) => {
  try {
    const src = await prisma.job.findUnique({ where: { id: req.params.id as string }, include });
    if (!src) throw notFound("Job not found");
    const slug = await uniqueJobSlug(`${src.slug}-copy`);
    const item = await prisma.job.create({
      data: {
        slug,
        status: "DRAFT",
        departmentId: src.departmentId,
        employmentType: src.employmentType,
        workplaceType: src.workplaceType,
        experienceLevel: src.experienceLevel,
        openings: src.openings,
        salaryMin: src.salaryMin,
        salaryMax: src.salaryMax,
        salaryCurrency: src.salaryCurrency,
        showSalary: src.showSalary,
        isUrgent: false,
        applyEmail: src.applyEmail,
        portals: src.portals as Prisma.InputJsonValue,
        createdById: req.user!.id,
        updatedById: req.user!.id,
        locations: { connect: src.locations.map((l) => ({ id: l.id })) },
        translations: {
          create: src.translations.map((t) => ({
            locale: t.locale,
            title: `${t.title} (copy)`,
            summary: t.summary,
            responsibilities: t.responsibilities,
            qualifications: t.qualifications,
            niceToHave: t.niceToHave,
            benefits: t.benefits,
          })),
        },
      },
      include,
    });
    logActivity(req, { action: "duplicate", entity: "job", entityId: item.id, summary: `Duplicated job "${titleOf(src)}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

hrRouter.delete("/jobs/:id", requireHr("jobs.delete"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({ where: { id }, include });
    if (!job) throw notFound("Job not found");
    await prisma.job.delete({ where: { id } });
    bust();
    logActivity(req, { action: "delete", entity: "job", entityId: id, summary: `Deleted job "${titleOf(job)}"` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── Departments & locations ──
const deptSchema = z.object({
  nameId: z.string().trim().min(2).max(80),
  nameEn: z.string().trim().max(80).nullable().optional(),
  slug: z.string().trim().max(80).optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
const locSchema = z.object({
  city: z.string().trim().min(2).max(80),
  province: z.string().trim().max(80).nullable().optional(),
  country: z.string().trim().min(2).max(60).default("Indonesia"),
  countryCode: z.string().trim().length(2).default("ID").transform((s) => s.toUpperCase()),
  slug: z.string().trim().max(80).optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

hrRouter.get("/departments", requireHr("jobs.read"), async (_req, res, next) => {
  try {
    const items = await prisma.jobDepartment.findMany({ orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }], include: { _count: { select: { jobs: true } } } });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});
hrRouter.post("/departments", requireHr("taxonomy.write"), validate(deptSchema), async (req, res, next) => {
  try {
    const d = getValidated<typeof deptSchema>(req);
    const slug = await uniqueSlug(d.slug || d.nameEn || d.nameId, async (s) => !!(await prisma.jobDepartment.findUnique({ where: { slug: s } })));
    const item = await prisma.jobDepartment.create({ data: { ...d, nameEn: d.nameEn ?? null, slug } });
    bust();
    logActivity(req, { action: "create", entity: "job-department", entityId: item.id, summary: `Added division "${item.nameId}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});
hrRouter.patch("/departments/:id", requireHr("taxonomy.write"), validate(deptSchema.partial()), async (req, res, next) => {
  try {
    const d = getValidated<typeof deptSchema>(req);
    const item = await prisma.jobDepartment.update({ where: { id: req.params.id as string }, data: { ...d, ...(d.slug ? { slug: slugify(d.slug) } : {}) } });
    bust();
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});
hrRouter.delete("/departments/:id", requireHr("taxonomy.write"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const used = await prisma.job.count({ where: { departmentId: id, status: { in: ["PUBLISHED", "PENDING_REVIEW", "DRAFT"] } } });
    if (used) throw badRequest(`This division is used by ${used} active job(s). Deactivate it instead, or move those jobs first.`);
    await prisma.jobDepartment.delete({ where: { id } });
    bust();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

hrRouter.get("/locations", requireHr("jobs.read"), async (_req, res, next) => {
  try {
    const items = await prisma.jobLocation.findMany({ orderBy: [{ country: "asc" }, { sortOrder: "asc" }, { city: "asc" }], include: { _count: { select: { jobs: true } } } });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});
hrRouter.post("/locations", requireHr("taxonomy.write"), validate(locSchema), async (req, res, next) => {
  try {
    const d = getValidated<typeof locSchema>(req);
    const slug = await uniqueSlug(d.slug || d.city, async (s) => !!(await prisma.jobLocation.findUnique({ where: { slug: s } })));
    const item = await prisma.jobLocation.create({ data: { ...d, province: d.province ?? null, slug } });
    bust();
    logActivity(req, { action: "create", entity: "job-location", entityId: item.id, summary: `Added location "${item.city}, ${item.country}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});
hrRouter.patch("/locations/:id", requireHr("taxonomy.write"), validate(locSchema.partial()), async (req, res, next) => {
  try {
    const d = getValidated<typeof locSchema>(req);
    const item = await prisma.jobLocation.update({ where: { id: req.params.id as string }, data: { ...d, ...(d.slug ? { slug: slugify(d.slug) } : {}) } });
    bust();
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});
hrRouter.delete("/locations/:id", requireHr("taxonomy.write"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const used = await prisma.job.count({ where: { locations: { some: { id } }, status: { in: ["PUBLISHED", "PENDING_REVIEW", "DRAFT"] } } });
    if (used) throw badRequest(`This location is used by ${used} active job(s). Deactivate it instead, or update those jobs first.`);
    await prisma.jobLocation.delete({ where: { id } });
    bust();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── HR settings (contact & application) ──
hrRouter.get("/settings", requireHr("jobs.read"), async (_req, res, next) => {
  try {
    res.json({ ok: true, data: await getHrSettings() });
  } catch (e) {
    next(e);
  }
});
hrRouter.put("/settings", requireHr("settings.write"), validate(hrSettingsSchema), async (req, res, next) => {
  try {
    const data = await saveHrSettings(getValidated<typeof hrSettingsSchema>(req));
    bust();
    logActivity(req, { action: "update", entity: "hr-settings", summary: "Updated HR contact & application settings" });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

// ─── Public router (career page) ─────────────────────────────────────────────
export const publicCareersRouter = Router();

function toPublic(j: JobWithRel, locale: "id" | "en") {
  const t = j.translations.find((x) => x.locale === locale) ?? j.translations.find((x) => x.locale === "id") ?? j.translations[0];
  return {
    id: j.id,
    slug: j.slug,
    status: j.status,
    locale: t.locale,
    title: t.title,
    summary: t.summary,
    responsibilities: t.responsibilities,
    qualifications: t.qualifications,
    niceToHave: t.niceToHave,
    benefits: t.benefits,
    department: j.department ? { slug: j.department.slug, name: locale === "en" ? (j.department.nameEn ?? j.department.nameId) : j.department.nameId } : null,
    locations: j.locations.map((l) => ({ slug: l.slug, city: l.city, province: l.province, country: l.country, countryCode: l.countryCode })),
    employmentType: j.employmentType,
    workplaceType: j.workplaceType,
    experienceLevel: j.experienceLevel,
    openings: j.openings,
    salary: j.showSalary && (j.salaryMin || j.salaryMax) ? { min: j.salaryMin, max: j.salaryMax, currency: j.salaryCurrency } : null,
    isUrgent: j.isUrgent,
    applyEmail: j.applyEmail,
    portals: (j.portals as { name: string; url: string }[]) ?? [],
    publishedAt: j.publishedAt,
    closesAt: j.closesAt,
    updatedAt: j.updatedAt,
  };
}

publicCareersRouter.get("/", async (req, res, next) => {
  try {
    const locale = LOCALE.catch("id").parse(req.query.locale);
    await autoCloseJobs();
    const data = await cached(`public:careers:${locale}`, [CacheTags.jobs], async () => {
      const [jobs, departments, locations, settings] = await Promise.all([
        prisma.job.findMany({ where: { status: "PUBLISHED" }, include, orderBy: [{ isUrgent: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }] }),
        prisma.jobDepartment.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }] }),
        prisma.jobLocation.findMany({ where: { isActive: true }, orderBy: [{ country: "asc" }, { sortOrder: "asc" }, { city: "asc" }] }),
        getHrSettings(),
      ]);
      const items = jobs.map((j) => toPublic(j, locale));
      const usedDept = new Set(items.map((i) => i.department?.slug).filter(Boolean));
      const usedLoc = new Set(items.flatMap((i) => i.locations.map((l) => l.slug)));
      return {
        items,
        filters: {
          departments: departments.filter((d) => usedDept.has(d.slug)).map((d) => ({ slug: d.slug, name: locale === "en" ? (d.nameEn ?? d.nameId) : d.nameId })),
          locations: locations.filter((l) => usedLoc.has(l.slug)).map((l) => ({ slug: l.slug, city: l.city, country: l.country, countryCode: l.countryCode })),
        },
        settings: publicSettings(settings, locale),
      };
    });
    res.json({ ok: true, ...data });
  } catch (e) {
    next(e);
  }
});

function publicSettings(s: Awaited<ReturnType<typeof getHrSettings>>, locale: "id" | "en") {
  return {
    contactName: s.contactName,
    contactEmail: s.contactEmail,
    ccEmail: s.ccEmail ?? null,
    phone: s.phone ?? null,
    whatsapp: s.whatsapp ?? null,
    emailSubject: locale === "en" ? s.emailSubjectEn : s.emailSubjectId,
    applicationNote: (locale === "en" ? s.applicationNoteEn : s.applicationNoteId) ?? null,
    openApplicationEnabled: s.openApplicationEnabled,
    companyPortals: s.companyPortals.filter((p) => p.enabled).map((p) => ({ name: p.name, url: p.url })),
  };
}

publicCareersRouter.get("/:slug", async (req, res, next) => {
  try {
    const locale = LOCALE.catch("id").parse(req.query.locale);
    const slug = req.params.slug as string;
    const data = await cached(`public:career:${locale}:${slug}`, [CacheTags.jobs], async () => {
      // Closed jobs stay reachable (shown as closed, noindex) so shared links don't 404.
      const j = await prisma.job.findFirst({ where: { slug, status: { in: ["PUBLISHED", "CLOSED"] } }, include });
      if (!j) return null;
      return { job: toPublic(j, locale), settings: publicSettings(await getHrSettings(), locale) };
    });
    if (!data) throw notFound("Job not found");
    if (data.job.status === "PUBLISHED") prisma.job.update({ where: { id: data.job.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

const clickLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false });
const clickSchema = z.object({ channel: z.string().trim().min(1).max(40) });

publicCareersRouter.post("/:slug/click", clickLimiter, validate(clickSchema), async (req, res, next) => {
  try {
    const { channel } = getValidated<typeof clickSchema>(req);
    const job = await prisma.job.findFirst({ where: { slug: req.params.slug as string, status: "PUBLISHED" }, select: { id: true } });
    if (job) await prisma.jobApplyClick.create({ data: { jobId: job.id, channel } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
