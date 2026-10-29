-- Pulihkan "updatedAt" artikel & lowongan yang tergeser penghitung view.
--
-- Sebelumnya endpoint publik menambah viewCount lewat prisma.update(), dan Prisma menyetel
-- @updatedAt pada SETIAP update. Penghitung itu jalan setiap halaman di-render ulang (ISR,
-- revalidate saat deploy), sehingga kolom "Updated" di admin, lastmod sitemap, dan dateModified
-- artikel ikut "baru" padahal isinya tidak diubah. Kode kini memakai SQL langsung.
--
-- Waktu perubahan nyata terakhir = yang paling akhir dari: dibuat, aktivitas admin di Activity Log
-- (termasuk aksi massal lewat meta.ids), terbit (termasuk terbit terjadwal), dan tutup otomatis
-- (lowongan). Hanya MENURUNKAN updatedAt yang lebih baru dari itu; tidak pernah menaikkan.

WITH act AS (
  SELECT COALESCE(l."entityId", ids.id) AS id, max(l."createdAt") AS last
  FROM "ActivityLog" l
  LEFT JOIN LATERAL jsonb_array_elements_text(
    CASE WHEN jsonb_typeof(l."meta" -> 'ids') = 'array' THEN l."meta" -> 'ids' ELSE '[]'::jsonb END
  ) AS ids(id) ON l."entityId" IS NULL
  WHERE l."entity" = 'article'
  GROUP BY 1
), real AS (
  SELECT a."id",
         GREATEST(
           a."createdAt",
           COALESCE(act.last, a."createdAt"),
           CASE WHEN a."publishedAt" <= now() THEN a."publishedAt" ELSE a."createdAt" END
         ) AS last_real
  FROM "Article" a
  LEFT JOIN act ON act.id = a."id"
)
UPDATE "Article" a
SET "updatedAt" = real.last_real
FROM real
WHERE a."id" = real."id" AND a."updatedAt" > real.last_real + interval '5 seconds';

WITH act AS (
  SELECT COALESCE(l."entityId", ids.id) AS id, max(l."createdAt") AS last
  FROM "ActivityLog" l
  LEFT JOIN LATERAL jsonb_array_elements_text(
    CASE WHEN jsonb_typeof(l."meta" -> 'ids') = 'array' THEN l."meta" -> 'ids' ELSE '[]'::jsonb END
  ) AS ids(id) ON l."entityId" IS NULL
  WHERE l."entity" = 'job'
  GROUP BY 1
), real AS (
  SELECT j."id",
         GREATEST(
           j."createdAt",
           COALESCE(act.last, j."createdAt"),
           COALESCE(j."closedAt", j."createdAt"),
           CASE WHEN j."publishedAt" <= now() THEN j."publishedAt" ELSE j."createdAt" END
         ) AS last_real
  FROM "Job" j
  LEFT JOIN act ON act.id = j."id"
)
UPDATE "Job" j
SET "updatedAt" = real.last_real
FROM real
WHERE j."id" = real."id" AND j."updatedAt" > real.last_real + interval '5 seconds';
