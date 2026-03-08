"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {

    if (!session && status !== "loading") {
      router.push("/login");
      return;
    }

    if (session?.accessToken) {
      try {

        const decoded = jwtDecode<DecodedToken>(session.accessToken);

        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          signOut({ callbackUrl: "/login" });
        }

      } catch {
        signOut({ callbackUrl: "/login" });
      }
    }

  }, [session, status, router]);

  return <>{children}</>;
}