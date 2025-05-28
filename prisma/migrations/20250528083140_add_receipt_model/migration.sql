-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "teamId" TEXT;

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "teamId" TEXT;

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "metadata" TEXT;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "activeOrganizationId" TEXT,
ADD COLUMN     "impersonatedBy" TEXT;

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);
