-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_fault_code_fkey";

-- AlterTable
ALTER TABLE "status_logs" ALTER COLUMN "fault_code" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE SET NULL ON UPDATE CASCADE;
