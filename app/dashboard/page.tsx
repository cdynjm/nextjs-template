"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
        <div className="flex flex-col w-full min-h-screen">
            <Navbar title="Dashboard" />
            <main className="p-6 flex-1">
    
            </main>
        </div>
    </SidebarProvider>
  );
}
