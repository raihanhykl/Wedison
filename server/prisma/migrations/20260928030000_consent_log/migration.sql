-- CreateEnum
CREATE TYPE "ConsentAction" AS ENUM ('ACCEPT_ALL', 'REJECT_ALL', 'CUSTOM');

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "consentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "action" "ConsentAction" NOT NULL,
    "analytics" BOOLEAN NOT NULL,
    "marketing" BOOLEAN NOT NULL,
    "locale" TEXT,
    "path" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsentLog_consentId_idx" ON "ConsentLog"("consentId");

-- CreateIndex
CREATE INDEX "ConsentLog_createdAt_idx" ON "ConsentLog"("createdAt");
