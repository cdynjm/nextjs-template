// test-prisma.ts
import 'dotenv/config';
import { prisma } from './lib/db/postgres-prisma'; // path to your prisma.ts

async function test() {
  try {
    const user = await prisma.user.findFirst();
    console.log('User:', user);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();