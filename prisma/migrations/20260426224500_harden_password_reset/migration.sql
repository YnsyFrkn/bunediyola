-- Rename token storage to make the intent explicit: raw tokens are emailed only,
-- while the database stores hashes.
ALTER TABLE "PasswordResetToken" RENAME COLUMN "token" TO "tokenHash";

ALTER INDEX "PasswordResetToken_token_key" RENAME TO "PasswordResetToken_tokenHash_key";

ALTER TABLE "PasswordResetToken" ADD COLUMN "ipAddress" TEXT;

CREATE INDEX "PasswordResetToken_ipAddress_createdAt_idx" ON "PasswordResetToken"("ipAddress", "createdAt");

CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PasswordResetRequest_email_createdAt_idx" ON "PasswordResetRequest"("email", "createdAt");
CREATE INDEX "PasswordResetRequest_ipAddress_createdAt_idx" ON "PasswordResetRequest"("ipAddress", "createdAt");
CREATE INDEX "PasswordResetRequest_createdAt_idx" ON "PasswordResetRequest"("createdAt");
