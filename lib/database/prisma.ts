
import { database } from '@/lib/helpers/database-name'

let prismaClient;

if (database() === 'mysql') {
  const { prisma } = await import('@/prisma/mysql-prisma');
  prismaClient = prisma;
} else {
  const { prisma } = await import('@/prisma/postgres-prisma');
  prismaClient = prisma;
}

export const prisma = prismaClient;