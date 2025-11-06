-- DropForeignKey
ALTER TABLE "public"."equipment_status" DROP CONSTRAINT "equipment_status_device_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."equipment_status" DROP CONSTRAINT "equipment_status_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_fault_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_fault_code_fkey";
