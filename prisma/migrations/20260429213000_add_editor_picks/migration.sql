ALTER TABLE "Post" ADD COLUMN "isEditorPick" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Post"
SET "isEditorPick" = true
WHERE "status" = 'PUBLISHED'
  AND "deletedAt" IS NULL
  AND "viewCount" >= 1000;
