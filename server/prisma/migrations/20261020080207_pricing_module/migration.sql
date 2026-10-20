-- CreateEnum
CREATE TYPE "ProductModel" AS ENUM ('BEES', 'ATHENA', 'VICTORY', 'EDPOWER');

-- CreateEnum
CREATE TYPE "BatteryVariant" AS ENUM ('SINGLE', 'REGULAR', 'EXTENDED');

-- CreateEnum
CREATE TYPE "PricingSchemeKind" AS ENUM ('PURCHASE', 'RENT_TO_OWN', 'RENTAL', 'B2B_CREDIT', 'BAAS');

-- CreateEnum
CREATE TYPE "PricingAudience" AS ENUM ('ALL', 'OJOL', 'B2B');

-- CreateTable
CREATE TABLE "PriceRegion" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "priceLabelId" TEXT NOT NULL DEFAULT '',
    "priceLabelEn" TEXT NOT NULL DEFAULT '',
    "coverageId" TEXT,
    "coverageEn" TEXT,
    "salesWhatsapp" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingScheme" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "PricingSchemeKind" NOT NULL,
    "nameId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "taglineId" TEXT,
    "taglineEn" TEXT,
    "descriptionId" TEXT,
    "descriptionEn" TEXT,
    "audience" "PricingAudience" NOT NULL DEFAULT 'ALL',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceEntry" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "model" "ProductModel" NOT NULL,
    "variant" "BatteryVariant" NOT NULL DEFAULT 'SINGLE',
    "otrPrice" INTEGER,
    "discount" INTEGER,
    "netPrice" INTEGER,
    "dailyFee" INTEGER,
    "downPayment" INTEGER,
    "termMonths" INTEGER,
    "installment24" INTEGER,
    "installment36" INTEGER,
    "unitPrice" INTEGER,
    "monthlyFee" INTEGER,
    "noteId" TEXT,
    "noteEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingTerms" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "includedId" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "includedEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "termsId" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "termsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "partners" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "noteId" TEXT,
    "noteEn" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingTerms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceRegion_slug_key" ON "PriceRegion"("slug");

-- CreateIndex
CREATE INDEX "PriceRegion_isActive_sortOrder_idx" ON "PriceRegion"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PricingScheme_slug_key" ON "PricingScheme"("slug");

-- CreateIndex
CREATE INDEX "PricingScheme_isActive_isPublic_sortOrder_idx" ON "PricingScheme"("isActive", "isPublic", "sortOrder");

-- CreateIndex
CREATE INDEX "PriceEntry_schemeId_model_idx" ON "PriceEntry"("schemeId", "model");

-- CreateIndex
CREATE UNIQUE INDEX "PriceEntry_regionId_schemeId_model_variant_key" ON "PriceEntry"("regionId", "schemeId", "model", "variant");

-- CreateIndex
CREATE UNIQUE INDEX "PricingTerms_regionId_schemeId_key" ON "PricingTerms"("regionId", "schemeId");

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "PriceRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "PricingScheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingTerms" ADD CONSTRAINT "PricingTerms_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "PriceRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingTerms" ADD CONSTRAINT "PricingTerms_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "PricingScheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Izin modul Pricing untuk role bawaan (role kustom lain diatur dari admin).
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['pricing.view','pricing.write','pricing.delete'])
  WHERE "key" = 'admin' AND NOT ('pricing.view' = ANY("permissions"));
UPDATE "Role" SET "permissions" = array_cat("permissions", ARRAY['pricing.view','pricing.write'])
  WHERE "key" IN ('editor','marketing') AND NOT ('pricing.view' = ANY("permissions"));
