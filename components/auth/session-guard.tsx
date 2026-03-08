"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/use-auth";
interface DecodedToken {
  exp: number;
}

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (!session && status !== "loading") {
      router.push("/login");
      return;
    }

    if (user?.accessToken) {
      try {

        const decoded = jwtDecode<DecodedToken>(user?.accessToken);

        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          signOut({ callbackUrl: "/login" });
        }

      } catch {
        signOut({ callbackUrl: "/login" });
      }
    }

  }, [session, user, status, router]);

  return <>{children}</>;
}