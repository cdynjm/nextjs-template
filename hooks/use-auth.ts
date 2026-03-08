"use client";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";

export function useAuth() {
  const { data, status } = useSession();

  const session = data as Session | null;

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}