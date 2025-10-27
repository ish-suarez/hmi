/*
  Warnings:

  - The `value_reading` column on the `status_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_equipment_id_fkey";

-- AlterTable
ALTER TABLE "status_logs" DROP COLUMN "value_reading",
ADD COLUMN     "value_reading" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "equipment_status_equipment_id_idx" ON "equipment_status"("equipment_id");

-- CreateIndex
CREATE INDEX "fault_codes_fault_code_idx" ON "fault_codes"("fault_code");

-- CreateIndex
CREATE INDEX "locations_location_id_idx" ON "locations"("location_id");

-- CreateIndex
CREATE INDEX "status_logs_status_idx" ON "status_logs"("status");

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE CASCADE ON UPDATE CASCADE;
