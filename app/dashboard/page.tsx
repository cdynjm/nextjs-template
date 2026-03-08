"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";

export default function DashboardPage() {
  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Dashboard" />
          <main className="p-6 flex-1"></main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}