"use client";

import SessionGuard from "@/components/auth/session-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { SkeletonDelay } from "@/components/ui/skeleton-delay";
import { SkeletonCard } from "@/components/skeleton-card";
import FormattedDate from "@/components/formatted-date";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const { user } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${user?.accessToken || ""}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      return res.json();
    },
  });

  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Users" />
          <main className="p-6 flex-1">
            <SkeletonDelay skeleton={<SkeletonCard />}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="">
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={3}>Loading...</TableCell>
                      </TableRow>
                    )}

                    {users.map((user: User, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <FormattedDate date={user.createdAt} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SkeletonDelay>
          </main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
