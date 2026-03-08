"use client";

import { useSession } from "next-auth/react";
import { AuthSession } from "@/types/auth";

export function useAuth() {
  const { data, status } = useSession();

  const session = data as AuthSession | null;

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}