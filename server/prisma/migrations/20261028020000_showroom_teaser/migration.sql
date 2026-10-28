-- CreateEnum
CREATE TYPE "TeaserStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "ShowroomTeaser" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "showroomName" TEXT NOT NULL,
    "status" "TeaserStatus" NOT NULL DEFAULT 'DRAFT',
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "timeZone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "showCountdown" BOOLEAN NOT NULL DEFAULT true,
    "streetAddress" TEXT NOT NULL DEFAULT '',
    "addressLocality" TEXT NOT NULL DEFAULT '',
    "addressRegion" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "mapsUrl" TEXT,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "models" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "images" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowroomTeaser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowroomTeaser_slug_key" ON "ShowroomTeaser"("slug");

-- CreateIndex
CREATE INDEX "ShowroomTeaser_status_startAt_idx" ON "ShowroomTeaser"("status", "startAt");
