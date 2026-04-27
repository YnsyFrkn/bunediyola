-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'REPORT_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'SYSTEM_ALERT';
ALTER TYPE "NotificationType" ADD VALUE 'ERROR';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN "dedupeKey" TEXT;

-- CreateIndex
CREATE INDEX "Notification_dedupeKey_createdAt_idx" ON "Notification"("dedupeKey", "createdAt");
