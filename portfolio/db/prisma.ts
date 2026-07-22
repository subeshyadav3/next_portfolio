import { PrismaClient } from "@prisma/client";

// In dev, Next.js hot-reloads modules and would create one PrismaClient
// per reload — quickly exhausting the DB connection pool. Cache the
// instance on globalThis to survive HMR.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
