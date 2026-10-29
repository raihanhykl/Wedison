-- CreateEnum
CREATE TYPE "ShowroomStatus" AS ENUM ('OPEN', 'COMING_SOON', 'TEMPORARILY_CLOSED', 'CLOSED');

-- AlterTable
ALTER TABLE "ShowroomTeaser" ADD COLUMN     "showroomId" TEXT;

-- CreateTable
CREATE TABLE "Showroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" "ShowroomStatus" NOT NULL DEFAULT 'OPEN',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "bookable" BOOLEAN NOT NULL DEFAULT true,
    "country" TEXT NOT NULL DEFAULT 'ID',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "streetAddress" TEXT NOT NULL DEFAULT '',
    "addressLocality" TEXT NOT NULL DEFAULT '',
    "addressRegion" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "mapsUrl" TEXT,
    "whatsapp" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "hours" JSONB NOT NULL,
    "closures" JSONB NOT NULL DEFAULT '[]',
    "hasWorkshop" BOOLEAN NOT NULL DEFAULT true,
    "hasSupercharge" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Showroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Showroom_status_isPublic_sortOrder_idx" ON "Showroom"("status", "isPublic", "sortOrder");

-- CreateIndex
CREATE INDEX "ShowroomTeaser_showroomId_idx" ON "ShowroomTeaser"("showroomId");

-- AddForeignKey
ALTER TABLE "ShowroomTeaser" ADD CONSTRAINT "ShowroomTeaser_showroomId_fkey" FOREIGN KEY ("showroomId") REFERENCES "Showroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Data awal: 4 showroom yang sebelumnya di-hardcode di src/lib/booking/showrooms.ts,
-- src/lib/seo/showrooms.ts, dan server/src/modules/leads/booking-rules.ts.
-- Alamat Jakarta mengikuti situs (Jl. Sultan Iskandar Muda), dikonfirmasi 2026-10-28.
-- Aman diulang: baris yang sudah ada tidak ditimpa.
INSERT INTO "Showroom" ("id", "name", "city", "status", "isPublic", "bookable", "country", "sortOrder", "streetAddress", "addressLocality", "addressRegion", "postalCode", "lat", "lng", "mapsUrl", "whatsapp", "timeZone", "hours", "closures", "hasWorkshop", "hasSupercharge", "photoUrl", "updatedAt") VALUES
  ('jakarta', 'Wedison Jakarta', 'Jakarta', 'OPEN', true, true, 'ID', 10, 'Jl. Sultan Iskandar Muda No. 30 A-C, Kebayoran Lama', 'Jakarta Selatan', 'DKI Jakarta', '12240', -6.2484, 106.781, 'https://www.google.com/maps/place/Wedison+Showroom/@-6.248464,106.7806209,19z/data=!4m10!1m2!2m1!1swedison+showroom!3m6!1s0x2e69f10019a26049:0xa59abd5e111a8a10!8m2!3d-6.248447!4d106.7810459!15sChB3ZWRpc29uIHNob3dyb29tWhIiEHdlZGlzb24gc2hvd3Jvb22SARplbGVjdHJpY19tb3RvcmN5Y2xlX2RlYWxlcqoBOBABMh4QASIa377C9bwSIpBp7hHS_qeMc_QbuBNmgIsWHu0yFBACIhB3ZWRpc29uIHNob3dyb29t4AEA!16s%2Fg%2F11x1nqm1sg!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D', '6285286126550', 'Asia/Jakarta', '{"mon": {"open": "10:00", "close": "19:00"}, "tue": {"open": "10:00", "close": "19:00"}, "wed": {"open": "10:00", "close": "19:00"}, "thu": {"open": "10:00", "close": "19:00"}, "fri": {"open": "10:00", "close": "19:00"}, "sat": {"open": "10:00", "close": "17:00"}, "sun": {"open": "10:00", "close": "17:00"}, "holiday": {"open": "10:00", "close": "16:00"}}'::jsonb, '[]'::jsonb, true, true, '/ShowRoom-Receptionist.webp', CURRENT_TIMESTAMP),
  ('bekasi', 'Wedison Bekasi', 'Bekasi', 'OPEN', true, true, 'ID', 20, 'Jl. HM. Joyo Martono, RT.003/RW.021, Margahayu, Bekasi Timur', 'Kota Bekasi', 'Jawa Barat', '17113', -6.2597989, 107.0199037, 'https://maps.app.goo.gl/DXB6csamG8R78XoP9', '6285286126550', 'Asia/Jakarta', '{"mon": {"open": "10:00", "close": "19:00"}, "tue": {"open": "10:00", "close": "19:00"}, "wed": {"open": "10:00", "close": "19:00"}, "thu": {"open": "10:00", "close": "19:00"}, "fri": {"open": "10:00", "close": "19:00"}, "sat": {"open": "10:00", "close": "17:00"}, "sun": {"open": "10:00", "close": "17:00"}, "holiday": {"open": "10:00", "close": "16:00"}}'::jsonb, '[]'::jsonb, true, true, '/showroom-waitingroom.webp', CURRENT_TIMESTAMP),
  ('bandung', 'Wedison Bandung', 'Bandung', 'OPEN', true, true, 'ID', 30, 'Jl. Raya Gadobangkong No. 154, Gadobangkong, Ngamprah', 'Kabupaten Bandung Barat', 'Jawa Barat', '40552', -6.86542, 107.514505, 'https://maps.app.goo.gl/T86DfRuAkHFBmhMs8', '6285286126558', 'Asia/Jakarta', '{"mon": {"open": "10:00", "close": "19:00"}, "tue": {"open": "10:00", "close": "19:00"}, "wed": {"open": "10:00", "close": "19:00"}, "thu": {"open": "10:00", "close": "19:00"}, "fri": {"open": "10:00", "close": "19:00"}, "sat": {"open": "10:00", "close": "17:00"}, "sun": {"open": "10:00", "close": "17:00"}, "holiday": {"open": "10:00", "close": "16:00"}}'::jsonb, '[]'::jsonb, true, true, '/super-charge/supercharge-charging.webp', CURRENT_TIMESTAMP),
  ('bali', 'Wedison Bali', 'Bali', 'OPEN', true, true, 'ID', 40, 'Jl. Gatot Subroto Tengah No. 93, Dangin Puri Kaja, Denpasar Utara', 'Kota Denpasar', 'Bali', '80118', -8.6359263, 115.2213254, 'https://maps.app.goo.gl/og4ovnG2FgCAQAWt8', '6285801011969', 'Asia/Makassar', '{"mon": {"open": "10:00", "close": "19:00"}, "tue": {"open": "10:00", "close": "19:00"}, "wed": {"open": "10:00", "close": "19:00"}, "thu": {"open": "10:00", "close": "19:00"}, "fri": {"open": "10:00", "close": "19:00"}, "sat": {"open": "10:00", "close": "17:00"}, "sun": {"open": "10:00", "close": "17:00"}, "holiday": {"open": "10:00", "close": "16:00"}}'::jsonb, '[]'::jsonb, true, false, '/new-looks/test image.webp', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Izin modul Showrooms untuk role bawaan: admin semua, marketing lihat+tulis, sales lihat.
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['showrooms.view','showrooms.write','showrooms.delete'])
  WHERE "key" = 'admin' AND NOT ('showrooms.view' = ANY("permissions"));
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['showrooms.view','showrooms.write'])
  WHERE "key" = 'marketing' AND NOT ('showrooms.view' = ANY("permissions"));
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['showrooms.view'])
  WHERE "key" = 'sales' AND NOT ('showrooms.view' = ANY("permissions"));
