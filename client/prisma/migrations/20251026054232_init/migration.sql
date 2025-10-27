/*
  Warnings:

  - The primary key for the `equipment_status` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_equipment_id_fkey";

-- AlterTable
ALTER TABLE "equipment_status" DROP CONSTRAINT "equipment_status_pkey",
ALTER COLUMN "equipment_id" DROP DEFAULT,
ALTER COLUMN "equipment_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "equipment_status_pkey" PRIMARY KEY ("equipment_id");
DROP SEQUENCE "equipment_status_equipment_id_seq";

-- AlterTable
ALTER TABLE "maintenance_events" ALTER COLUMN "equipment_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "status_logs" ALTER COLUMN "equipment_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;
