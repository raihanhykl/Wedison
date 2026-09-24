import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { z } from "zod";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { badRequest, notFound } from "../../lib/errors.js";

export const mediaRouter = Router();
mediaRouter.use(requireAuth);

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true);
    else cb(badRequest(`Tipe file ${file.mimetype} tidak didukung`));
  },
});

const uploadRoot = path.resolve(env.UPLOAD_DIR);

function monthFolder() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function safeBase(name: string) {
  return path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
}

/**
 * Simpan file: raster (jpg/png/webp/avif) -> dikonversi ke WebP (max 2000px) agar ringan
 * saat diserve di halaman publik; GIF/SVG disimpan apa adanya.
 */
async function persist(file: Express.Multer.File) {
  const folder = monthFolder();
  const dir = path.join(uploadRoot, folder);
  await fs.mkdir(dir, { recursive: true });
  const id = crypto.randomBytes(6).toString("hex");
  const base = safeBase(file.originalname);

  let buffer = file.buffer;
  let ext = path.extname(file.originalname).toLowerCase() || ".bin";
  let mime = file.mimetype;
  let width: number | null = null;
  let height: number | null = null;

  if (["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.mimetype)) {
    const img = sharp(file.buffer, { failOn: "none" }).rotate();
    const out = await img.resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
    buffer = out.data;
    ext = ".webp";
    mime = "image/webp";
    width = out.info.width;
    height = out.info.height;
  } else if (file.mimetype === "image/gif") {
    const meta = await sharp(file.buffer).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  }

  const filename = `${folder}/${base}-${id}${ext}`;
  await fs.writeFile(path.join(uploadRoot, filename), buffer);
  return { filename, mime, size: buffer.length, width, height, url: `${env.UPLOAD_PUBLIC_PATH}/${filename}` };
}

const listQuery = paginationQuery.extend({ folder: z.string().optional(), mime: z.string().optional() });

mediaRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.MediaWhereInput = {
      ...(q.folder ? { folder: q.folder } : {}),
      ...(q.mime ? { mimeType: { startsWith: q.mime } } : {}),
      ...(q.q ? { OR: [{ originalName: { contains: q.q, mode: "insensitive" } }, { alt: { contains: q.q, mode: "insensitive" } }] } : {}),
    };
    const [items, total, folders] = await Promise.all([
      prisma.media.findMany({ where, orderBy: { createdAt: "desc" }, include: { uploadedBy: { select: { id: true, name: true } } }, ...skipTake(q) }),
      prisma.media.count({ where }),
      prisma.media.groupBy({ by: ["folder"], _count: true }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q), folders: folders.map((f) => ({ name: f.folder, count: f._count })) });
  } catch (e) {
    next(e);
  }
});

// multipart: field "files" (bisa banyak), opsional "folder", "alt"
mediaRouter.post("/upload", requireRole("ADMIN", "EDITOR"), upload.array("files", 10), async (req, res, next) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (!files.length) throw badRequest("Tidak ada file yang diunggah");
    const folder = typeof req.body.folder === "string" && req.body.folder.trim() ? safeBase(req.body.folder) : "general";
    const alt = typeof req.body.alt === "string" ? req.body.alt : null;
    const created = [];
    for (const f of files) {
      const saved = await persist(f);
      created.push(
        await prisma.media.create({
          data: {
            filename: saved.filename,
            originalName: f.originalname,
            mimeType: saved.mime,
            size: saved.size,
            width: saved.width,
            height: saved.height,
            url: saved.url,
            alt,
            folder,
            uploadedById: req.user!.id,
          },
        }),
      );
    }
    invalidate([CacheTags.media], { notifyFrontend: false });
    logActivity(req, { action: "upload", entity: "media", summary: `Unggah ${created.length} file ke ${folder}` });
    res.status(201).json({ ok: true, items: created });
  } catch (e) {
    next(e);
  }
});

const patchSchema = z.object({
  alt: z.string().trim().max(200).nullable().optional(),
  caption: z.string().trim().max(500).nullable().optional(),
  folder: z.string().trim().max(60).optional(),
});

mediaRouter.patch("/:id", requireRole("ADMIN", "EDITOR"), validate(patchSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof patchSchema>(req);
    const item = await prisma.media.update({
      where: { id: req.params.id as string },
      data: { ...data, ...(data.folder ? { folder: safeBase(data.folder) } : {}) },
    });
    invalidate([CacheTags.articles]); // alt text ikut ke artikel publik
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

mediaRouter.delete("/:id", requireRole("ADMIN", "EDITOR"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.media.findUnique({ where: { id }, include: { _count: { select: { articlesAsCover: true } } } });
    if (!item) throw notFound();
    if (item._count.articlesAsCover > 0 && req.query.force !== "true")
      throw badRequest(`Media dipakai sebagai cover ${item._count.articlesAsCover} artikel. Lepas dulu atau hapus paksa.`);
    await prisma.media.delete({ where: { id } });
    await fs.rm(path.join(uploadRoot, item.filename), { force: true });
    invalidate([CacheTags.media, CacheTags.articles], { notifyFrontend: item._count.articlesAsCover > 0 });
    logActivity(req, { action: "delete", entity: "media", entityId: id, summary: `Hapus media ${item.originalName}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
