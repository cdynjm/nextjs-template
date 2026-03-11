import { PrismaClient } from '@/prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.POSTGRES_URL!,
      ssl: { rejectUnauthorized: false },
    }),
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;