-- AlterTable
ALTER TABLE "user" ADD COLUMN     "subscriptionId" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
