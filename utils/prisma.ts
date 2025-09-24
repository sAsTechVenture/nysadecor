import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Type for Prisma client with pricing rules
export type PrismaWithRules = PrismaClient & {
  pricingRule: {
    create: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    count: (args: any) => Promise<number>;
  };
};

// Helper function to get Prisma client with pricing rules
export const getPrismaWithRules = (): PrismaWithRules => {
  return prisma as PrismaWithRules;
};