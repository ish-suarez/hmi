/*
  Warnings:

  - Made the column `fault_code` on table `status_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_fault_code_fkey";

-- AlterTable
ALTER TABLE "status_logs" ALTER COLUMN "fault_code" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE RESTRICT ON UPDATE CASCADE;
