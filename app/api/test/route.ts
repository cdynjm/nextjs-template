// app/api/test/route.ts
import { prisma } from '@/prisma/postgres-prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
  }
}