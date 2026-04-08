import { prisma } from "@/lib/database/prisma";
import { compare } from "bcryptjs";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limiter";
import { RequestInternal } from "next-auth";

export async function authorizeUser(
  credentials: Record<"email" | "password", string> | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: Pick<RequestInternal, "body" | "query" | "headers" | "method">,
) {
  if (!credentials?.email || !credentials?.password) return null;

  const email = credentials.email.trim();

  if (checkRateLimit(email)) {
    throw new Error("Too many login attempts. Try again in 5 minutes.");
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) throw new Error("Invalid account credentials");

  const valid = await compare(credentials.password, user.password);

  if (!valid) throw new Error("Invalid account credentials");

  resetRateLimit(email);

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    role: user.role ?? "user", 
  };
}
