/*
  Warnings:

  - You are about to alter the column `price` on the `SubscriptionType` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "SubscriptionType" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
