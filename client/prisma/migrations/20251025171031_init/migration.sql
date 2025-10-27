/*
  Warnings:

  - You are about to drop the `Device_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipment_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fault_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Equipment_status" DROP CONSTRAINT "Equipment_status_device_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipment_status" DROP CONSTRAINT "Equipment_status_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance_events" DROP CONSTRAINT "maintenance_events_fault_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."status_logs" DROP CONSTRAINT "status_logs_fault_code_fkey";

-- DropTable
DROP TABLE "public"."Device_types";

-- DropTable
DROP TABLE "public"."Equipment_status";

-- DropTable
DROP TABLE "public"."Fault_codes";

-- DropTable
DROP TABLE "public"."Locations";

-- CreateTable
CREATE TABLE "device_types" (
    "device_type_id" SERIAL NOT NULL,
    "device_type_name" TEXT NOT NULL,

    CONSTRAINT "device_types_pkey" PRIMARY KEY ("device_type_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "fault_codes" (
    "fault_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "fault_codes_pkey" PRIMARY KEY ("fault_code")
);

-- CreateTable
CREATE TABLE "equipment_status" (
    "equipment_id" SERIAL NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "device_type_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "last_checked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fault_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "equipment_status_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_types_device_type_name_key" ON "device_types"("device_type_name");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_name_key" ON "locations"("location_name");

-- CreateIndex
CREATE UNIQUE INDEX "fault_codes_fault_code_key" ON "fault_codes"("fault_code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_status_equipment_id_key" ON "equipment_status"("equipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_status_equipment_name_key" ON "equipment_status"("equipment_name");

-- AddForeignKey
ALTER TABLE "equipment_status" ADD CONSTRAINT "equipment_status_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("device_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_status" ADD CONSTRAINT "equipment_status_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE RESTRICT ON UPDATE CASCADE;
