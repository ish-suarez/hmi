-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "technician_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "device_types" (
    "device_type_id" SERIAL NOT NULL,
    "device_type_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "device_types_pkey" PRIMARY KEY ("device_type_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "fault_codes" (
    "fault_code" TEXT NOT NULL,
    "fault_description" TEXT NOT NULL,

    CONSTRAINT "fault_codes_pkey" PRIMARY KEY ("fault_code")
);

-- CreateTable
CREATE TABLE "equipment_status" (
    "equipment_id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "device_type_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "last_checked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fault_code" TEXT,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "equipment_status_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateTable
CREATE TABLE "status_logs" (
    "log_id" SERIAL NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fault_code" TEXT,
    "value_reading" DOUBLE PRECISION,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operator_name" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "status_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "maintenance_events" (
    "event_id" SERIAL NOT NULL,
    "equipment_id" TEXT,
    "maintenance_type" TEXT NOT NULL,
    "fault_code" TEXT,
    "technician_name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "action_taken" TEXT,
    "parts_replaced" TEXT,
    "follow_up_required" BOOLEAN NOT NULL,

    CONSTRAINT "maintenance_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_types_device_type_name_key" ON "device_types"("device_type_name");

-- CreateIndex
CREATE INDEX "device_types_device_type_id_idx" ON "device_types"("device_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_name_key" ON "locations"("location_name");

-- CreateIndex
CREATE INDEX "locations_location_id_idx" ON "locations"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "fault_codes_fault_code_key" ON "fault_codes"("fault_code");

-- CreateIndex
CREATE INDEX "fault_codes_fault_code_idx" ON "fault_codes"("fault_code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_status_equipment_id_key" ON "equipment_status"("equipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_status_equipment_name_key" ON "equipment_status"("equipment_name");

-- CreateIndex
CREATE INDEX "equipment_status_equipment_id_idx" ON "equipment_status"("equipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_logs_log_id_key" ON "status_logs"("log_id");

-- CreateIndex
CREATE INDEX "status_logs_status_idx" ON "status_logs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_events_event_id_key" ON "maintenance_events"("event_id");

-- CreateIndex
CREATE INDEX "maintenance_events_event_id_idx" ON "maintenance_events"("event_id");

-- AddForeignKey
ALTER TABLE "equipment_status" ADD CONSTRAINT "equipment_status_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("device_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_status" ADD CONSTRAINT "equipment_status_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_status"("equipment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_fault_code_fkey" FOREIGN KEY ("fault_code") REFERENCES "fault_codes"("fault_code") ON DELETE SET NULL ON UPDATE CASCADE;
