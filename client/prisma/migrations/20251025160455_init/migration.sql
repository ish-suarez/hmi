/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

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

    CONSTRAINT "equipment_status_pkey" PRIMARY KEY ("equipment_id","device_type_id","location_id","fault_code")
);

-- CreateTable
CREATE TABLE "status_logs" (
    "log_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "fault_code" TEXT NOT NULL,
    "value_reading" TEXT NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operator_name" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "status_logs_pkey" PRIMARY KEY ("log_id","equipment_id","fault_code")
);

-- CreateTable
CREATE TABLE "maintenance_events" (
    "event_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "maintenance_type" TEXT NOT NULL,
    "fault_code" TEXT NOT NULL,
    "technician_name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_taken" TEXT NOT NULL,
    "parts_replaced" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "follow_up_required" BOOLEAN NOT NULL,

    CONSTRAINT "maintenance_events_pkey" PRIMARY KEY ("event_id","equipment_id","fault_code")
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

-- CreateIndex
CREATE UNIQUE INDEX "status_logs_log_id_key" ON "status_logs"("log_id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_events_event_id_key" ON "maintenance_events"("event_id");
