-- Audit "siapa" untuk semua modul CRUD admin + soft delete user.
-- createdById / updatedById = User.id (tanpa FK: user tidak pernah dihapus permanen lagi,
-- jadi id selalu bisa di-resolve; null = sistem, situs publik, atau data sebelum pencatatan).
-- Diisi otomatis oleh ekstensi Prisma (server/src/lib/audit.ts).

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "JobDepartment" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "JobLocation" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "PressCoverage" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "PriceEntry" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "PriceRegion" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "PricingScheme" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "PricingTerms" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Showroom" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "ShowroomTeaser" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "SocialPost" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- CreateIndex
CREATE INDEX "Article_createdById_idx" ON "Article"("createdById");

-- CreateIndex
CREATE INDEX "Article_updatedById_idx" ON "Article"("updatedById");

-- CreateIndex
CREATE INDEX "Booking_createdById_idx" ON "Booking"("createdById");

-- CreateIndex
CREATE INDEX "Booking_updatedById_idx" ON "Booking"("updatedById");

-- CreateIndex
CREATE INDEX "Category_createdById_idx" ON "Category"("createdById");

-- CreateIndex
CREATE INDEX "Category_updatedById_idx" ON "Category"("updatedById");

-- CreateIndex
CREATE INDEX "ContactSubmission_createdById_idx" ON "ContactSubmission"("createdById");

-- CreateIndex
CREATE INDEX "ContactSubmission_updatedById_idx" ON "ContactSubmission"("updatedById");

-- CreateIndex
CREATE INDEX "JobDepartment_createdById_idx" ON "JobDepartment"("createdById");

-- CreateIndex
CREATE INDEX "JobDepartment_updatedById_idx" ON "JobDepartment"("updatedById");

-- CreateIndex
CREATE INDEX "JobLocation_createdById_idx" ON "JobLocation"("createdById");

-- CreateIndex
CREATE INDEX "JobLocation_updatedById_idx" ON "JobLocation"("updatedById");

-- CreateIndex
CREATE INDEX "Media_createdById_idx" ON "Media"("createdById");

-- CreateIndex
CREATE INDEX "Media_updatedById_idx" ON "Media"("updatedById");

-- CreateIndex
CREATE INDEX "PressCoverage_createdById_idx" ON "PressCoverage"("createdById");

-- CreateIndex
CREATE INDEX "PressCoverage_updatedById_idx" ON "PressCoverage"("updatedById");

-- CreateIndex
CREATE INDEX "PriceEntry_createdById_idx" ON "PriceEntry"("createdById");

-- CreateIndex
CREATE INDEX "PriceEntry_updatedById_idx" ON "PriceEntry"("updatedById");

-- CreateIndex
CREATE INDEX "PriceRegion_createdById_idx" ON "PriceRegion"("createdById");

-- CreateIndex
CREATE INDEX "PriceRegion_updatedById_idx" ON "PriceRegion"("updatedById");

-- CreateIndex
CREATE INDEX "PricingScheme_createdById_idx" ON "PricingScheme"("createdById");

-- CreateIndex
CREATE INDEX "PricingScheme_updatedById_idx" ON "PricingScheme"("updatedById");

-- CreateIndex
CREATE INDEX "PricingTerms_createdById_idx" ON "PricingTerms"("createdById");

-- CreateIndex
CREATE INDEX "PricingTerms_updatedById_idx" ON "PricingTerms"("updatedById");

-- CreateIndex
CREATE INDEX "Role_createdById_idx" ON "Role"("createdById");

-- CreateIndex
CREATE INDEX "Role_updatedById_idx" ON "Role"("updatedById");

-- CreateIndex
CREATE INDEX "Setting_createdById_idx" ON "Setting"("createdById");

-- CreateIndex
CREATE INDEX "Setting_updatedById_idx" ON "Setting"("updatedById");

-- CreateIndex
CREATE INDEX "Showroom_createdById_idx" ON "Showroom"("createdById");

-- CreateIndex
CREATE INDEX "Showroom_updatedById_idx" ON "Showroom"("updatedById");

-- CreateIndex
CREATE INDEX "ShowroomTeaser_createdById_idx" ON "ShowroomTeaser"("createdById");

-- CreateIndex
CREATE INDEX "ShowroomTeaser_updatedById_idx" ON "ShowroomTeaser"("updatedById");

-- CreateIndex
CREATE INDEX "SocialPost_createdById_idx" ON "SocialPost"("createdById");

-- CreateIndex
CREATE INDEX "SocialPost_updatedById_idx" ON "SocialPost"("updatedById");

-- CreateIndex
CREATE INDEX "Station_createdById_idx" ON "Station"("createdById");

-- CreateIndex
CREATE INDEX "Station_updatedById_idx" ON "Station"("updatedById");

-- CreateIndex
CREATE INDEX "Tag_createdById_idx" ON "Tag"("createdById");

-- CreateIndex
CREATE INDEX "Tag_updatedById_idx" ON "Tag"("updatedById");

-- CreateIndex
CREATE INDEX "User_createdById_idx" ON "User"("createdById");

-- CreateIndex
CREATE INDEX "User_updatedById_idx" ON "User"("updatedById");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");


-- Backfill: timestamp baru diturunkan dari kolom yang sudah ada.
UPDATE "Media" SET "updatedAt" = "createdAt";
ALTER TABLE "Media" ALTER COLUMN "updatedAt" DROP DEFAULT;
UPDATE "Tag" SET "updatedAt" = "createdAt";
ALTER TABLE "Tag" ALTER COLUMN "updatedAt" DROP DEFAULT;
UPDATE "PriceEntry" SET "createdAt" = "updatedAt";
UPDATE "PricingTerms" SET "createdAt" = "updatedAt";
UPDATE "Setting" SET "createdAt" = "updatedAt";

-- Backfill: pembuat yang sudah tercatat dengan nama lain.
UPDATE "Article" SET "createdById" = "authorId" WHERE "createdById" IS NULL AND "authorId" IS NOT NULL;
UPDATE "Media" SET "createdById" = "uploadedById" WHERE "createdById" IS NULL AND "uploadedById" IS NOT NULL;
