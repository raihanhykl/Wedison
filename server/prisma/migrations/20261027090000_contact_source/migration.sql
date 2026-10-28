-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN "source" TEXT;

-- CreateIndex
CREATE INDEX "ContactSubmission_source_createdAt_idx" ON "ContactSubmission"("source", "createdAt");
