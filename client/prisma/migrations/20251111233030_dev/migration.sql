-- DropIndex
DROP INDEX "users_user_id_idx";

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");
