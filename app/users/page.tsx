"use client";

import { useSession } from "next-auth/react";
import SessionGuard from "@/components/auth/session-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const { data: session, status } = useSession();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      return res.json();
    },
  });

  if (status === "loading") return null;

  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Users" />

          <main className="p-6 flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3}>Loading...</TableCell>
                  </TableRow>
                )}

                {users.map((user: User, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
