"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const cards = [
  { title: "Users", value: "1,240", description: "Total registered users" },
  { title: "Revenue", value: "$8,320", description: "Monthly income" },
  { title: "Orders", value: "320", description: "Completed transactions" },
  { title: "Active Sessions", value: "89", description: "Currently online" },
];

export default function DashboardPage() {
  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Dashboard" />

          <main className="p-6 flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, index) => (
                <Card key={index} className="border border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}