-- AlterTable
ALTER TABLE "user" ADD COLUMN     "permissions" TEXT[],
ALTER COLUMN "role" SET DEFAULT 'user';
