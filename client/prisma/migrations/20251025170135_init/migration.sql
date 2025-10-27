/*
  Warnings:

  - The primary key for the `maintenance_events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `status_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `device_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fault_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "maintenance_events" DROP CONSTRAINT "maintenance_events_pkey",
ADD CONSTRAINT "maintenance_events_pkey" PRIMARY KEY ("event_id");

-- AlterTable
ALTER TABLE "status_logs" DROP CONSTRAINT "status_logs_pkey",
ADD CONSTRAINT "status_logs_pkey" PRIMARY KEY ("log_id");

-- DropTable
DROP TABLE "public"."device_types";

-- DropTable
DROP TABLE "public"."equipment_status";

-- DropTable
DROP TABLE "public"."fault_codes";

-- DropTable
DROP TABLE "public"."locations";

-- CreateTable
CREATE TABLE "Device_types" (
    "device_type_id" SERIAL NOT NULL,
    "device_type_name" TEXT NOT NULL,

    CONSTRAINT "Device_types_pkey" PRIMARY KEY ("device_type_id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "Fault_codes" (
    "fault_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Fault_codes_pkey" PRIMARY KEY ("fault_code")
);

-- CreateTable
CREATE TABLE "Equipment_status" (
    "equipment_id" SERIAL NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "device_type_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "last_checked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fault_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Equipment_status_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_types_device_type_name_key" ON "Device_types"("device_type_name");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_location_name_key" ON "Locations"("location_name");

-- CreateIndex
CREATE UNIQUE INDEX "Fault_codes_fault_code_key" ON "Fault_codes"("fault_code");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_status_equipment_id_key" ON "Equipment_status"("equipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_status_equipment_name_key" ON "Equipment_status"("equipment_name");

-- AddForeignKey
ALTER TABLE "Equipment_status" ADD CONSTRAINT "Equipment_status_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "Device_types"("device_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment_status" ADD CONSTRAINT "Equipment_status_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "Fault_codes"("fault_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "Fault_codes"("fault_code") ON DELETE RESTRICT ON UPDATE CASCADE;
