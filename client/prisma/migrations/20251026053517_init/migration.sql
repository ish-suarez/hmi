/*
  Warnings:

  - Made the column `action_taken` on table `maintenance_events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "maintenance_events" ALTER COLUMN "action_taken" SET NOT NULL;
