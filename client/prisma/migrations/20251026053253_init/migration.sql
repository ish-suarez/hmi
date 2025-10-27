-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_fault_code_fkey";

-- AlterTable
ALTER TABLE "maintenance_events" ALTER COLUMN "fault_code" DROP NOT NULL,
ALTER COLUMN "action_taken" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE SET NULL ON UPDATE CASCADE;
