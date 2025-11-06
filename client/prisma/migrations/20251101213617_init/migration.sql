-- AlterTable
ALTER TABLE "maintenance_events" ALTER COLUMN "action_taken" DROP NOT NULL,
ALTER COLUMN "parts_replaced" DROP NOT NULL;
