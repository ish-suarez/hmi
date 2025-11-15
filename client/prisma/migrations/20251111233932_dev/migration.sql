/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `technician_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_user_id_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "technician_name",
DROP COLUMN "updated_at";
