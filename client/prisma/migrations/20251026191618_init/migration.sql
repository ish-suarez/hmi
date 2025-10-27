-- AlterTable
ALTER TABLE "device_types" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "equipment_status" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "maintenance_events" ALTER COLUMN "end_time" DROP NOT NULL,
ALTER COLUMN "end_time" DROP DEFAULT;
