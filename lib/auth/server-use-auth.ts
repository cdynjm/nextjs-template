import { getServerSession } from "next-auth";
import { authOptions } from "./authenticate";
import { Session } from "next-auth";

export async function getAuth() {
  const session = (await getServerSession(authOptions)) as Session | null;

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    session
  };
}