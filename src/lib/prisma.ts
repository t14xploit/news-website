import { PrismaClient } from "@/generated/prisma";

const prisma = global.__prisma || new PrismaClient();

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
export { prisma };
