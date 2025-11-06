-- DropForeignKey
ALTER TABLE "public"."equipment_status" DROP CONSTRAINT "equipment_status_device_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."equipment_status" DROP CONSTRAINT "equipment_status_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_equipment_id_fkey";

-- AlterTable
ALTER TABLE "equipment_status" ALTER COLUMN "device_type_id" DROP NOT NULL,
ALTER COLUMN "location_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "maintenance_events" ALTER COLUMN "equipment_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "status_logs" ALTER COLUMN "equipment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "equipment_status" ADD CONSTRAINT "equipment_status_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("device_type_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_status" ADD CONSTRAINT "equipment_status_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE SET NULL ON UPDATE CASCADE;
