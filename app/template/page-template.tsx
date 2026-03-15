"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";
import { useAuth } from "@/lib/auth/session/client-use-auth";
import { SkeletonDelay } from "@/components/ui/skeleton-delay";
import { SkeletonCard } from "@/components/skeleton-card";
import Footer from "@/components/footer";

export default function Page() {
  const { user } = useAuth();

  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Profile" />
          <main className="p-6 flex-1">
            <SkeletonDelay skeleton={<SkeletonCard />}>
              {user?.email}
            </SkeletonDelay>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
