-- DropIndex
DROP INDEX "users_username_idx";

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");
