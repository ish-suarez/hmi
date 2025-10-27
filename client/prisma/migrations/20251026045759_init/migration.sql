/*
  Warnings:

  - You are about to drop the column `description` on the `fault_codes` table. All the data in the column will be lost.
  - Added the required column `fault_description` to the `fault_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fault_codes" DROP COLUMN "description",
ADD COLUMN     "fault_description" TEXT NOT NULL;
