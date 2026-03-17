import { useSession, getSession } from "next-auth/react";
import { Session } from "next-auth";

export function useAuth() {
  const { data, status, update } = useSession();

  const session = data as Session | null;

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    updateSession: update
  };
}

export async function getSessionAuth() {
  const session = await getSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading: false,
  };
}