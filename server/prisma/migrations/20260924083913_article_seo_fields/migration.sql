-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "noIndex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ogImageId" TEXT;

-- AlterTable
ALTER TABLE "ArticleTranslation" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "seoKeywords" TEXT;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
