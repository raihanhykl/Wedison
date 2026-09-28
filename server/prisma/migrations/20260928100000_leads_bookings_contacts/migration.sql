-- Leads: Booking showroom & ContactSubmission (dibuat dari `prisma migrate diff`, diterapkan manual)
-- CreateEnum
CREATE TYPE "BookingPurpose" AS ENUM ('TEST_RIDE', 'CONSULTATION', 'FINANCING', 'SERVICE', 'OTHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "CalendarSyncStatus" AS ENUM ('PENDING', 'SAVED', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "showroom" TEXT NOT NULL,
    "purpose" "BookingPurpose" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "source" TEXT,
    "locale" "Locale",
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "calendarStatus" "CalendarSyncStatus" NOT NULL DEFAULT 'PENDING',
    "calendarEventId" TEXT,
    "calendarLink" TEXT,
    "calendarError" TEXT,
    "adminNote" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" "Locale",
    "isHandled" BOOLEAN NOT NULL DEFAULT false,
    "handledAt" TIMESTAMP(3),
    "adminNote" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_startAt_idx" ON "Booking"("startAt");

-- CreateIndex
CREATE INDEX "Booking_showroom_status_idx" ON "Booking"("showroom", "status");

-- CreateIndex
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_isHandled_createdAt_idx" ON "ContactSubmission"("isHandled", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");
