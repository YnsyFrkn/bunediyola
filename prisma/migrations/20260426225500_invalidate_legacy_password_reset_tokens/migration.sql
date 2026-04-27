-- Existing reset links may have been created before token hashing was enabled.
-- Invalidate them so all future reset flows use hashed token storage only.
DELETE FROM "PasswordResetToken";
