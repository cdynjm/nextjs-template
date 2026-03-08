"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Profile" />
          <main className="p-6 flex-1">hello {user?.email}</main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
