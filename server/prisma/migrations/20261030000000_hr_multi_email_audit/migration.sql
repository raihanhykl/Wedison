-- HR: banyak penerima lamaran + CC per lowongan, dan relasi audit created/updated by.

-- 1) applyEmail (satu) -> applyEmails (daftar); ccEmails baru
ALTER TABLE "Job" ADD COLUMN "applyEmails" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Job" ADD COLUMN "ccEmails" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
UPDATE "Job" SET "applyEmails" = ARRAY[lower(trim("applyEmail"))] WHERE "applyEmail" IS NOT NULL AND trim("applyEmail") <> '';
ALTER TABLE "Job" DROP COLUMN "applyEmail";

-- 2) createdById / updatedById jadi foreign key ke User. Kolom sudah ada; id milik user yang
--    sudah dihapus dikosongkan dulu supaya constraint bisa dibuat.
UPDATE "Job" SET "createdById" = NULL WHERE "createdById" IS NOT NULL AND "createdById" NOT IN (SELECT "id" FROM "User");
UPDATE "Job" SET "updatedById" = NULL WHERE "updatedById" IS NOT NULL AND "updatedById" NOT IN (SELECT "id" FROM "User");
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Job" ADD CONSTRAINT "Job_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");
CREATE INDEX "Job_updatedAt_idx" ON "Job"("updatedAt");
CREATE INDEX "Job_createdById_idx" ON "Job"("createdById");
CREATE INDEX "Job_updatedById_idx" ON "Job"("updatedById");
