import { PrismaClient } from "@/prisma/app/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(withAccelerate());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export const db = prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;