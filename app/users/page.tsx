"use client";

import { useState, useEffect } from "react";
import SessionGuard from "@/components/auth/session-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { SkeletonDelay } from "@/components/ui/skeleton-delay";
import { SkeletonCard, SkeletonTable } from "@/components/skeleton-card";
import FormattedDate from "@/components/formatted-date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api/endpoints";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types";
import { ApiResponse } from "@/types";
import { QUERY_KEYS } from "@/lib/queries/query-keys";
import { Eye, EyeOff, PencilIcon, TrashIcon, UsersIcon } from "lucide-react";
interface UserForm {
  encrypted_id: string;
  name: string;
  email: string;
  password?: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: async () => {
      const res = await fetch(api.GET_USERS, {
        headers: { Authorization: `Bearer ${user?.accessToken || ""}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const [addingUser, setAddingUser] = useState<boolean | null>(null);

  const {
    register: createUserRegister,
    handleSubmit: createUserHandleSubmit,
    reset: createUserReset,
  } = useForm<UserForm>();

  const createUser = createUserHandleSubmit((data: UserForm) => {
    createMutation.mutate(data);
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserForm): Promise<ApiResponse> => {
      const res = await fetch(api.CREATE_USER, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.accessToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      return resData;
    },
    onSuccess: (data) => {
      toast("Created", {
        description: data.description,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });

      createUserReset({
        name: "",
        email: "",
        password: "",
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      setAddingUser(null);
    },
    onError: (error) => {
      if (error && typeof error === "object" && "description" in error) {
        const backendError = error as { description: string };
        toast("Opss sorry but ...", {
          description: backendError.description,
          action: {
            label: "Close",
            onClick: () => console.log(""),
          },
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    register: updateUserRegister,
    handleSubmit: updateUserHandleSubmit,
    reset: updateUserReset,
  } = useForm<UserForm>();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingUser) {
      updateUserReset({
        encrypted_id: editingUser.encrypted_id,
        name: editingUser.name,
        email: editingUser.email,
        password: "",
      });
    }
  }, [editingUser, updateUserReset]);

  const updateUser = updateUserHandleSubmit((data: UserForm) => {
    updateMutation.mutate(data);
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UserForm): Promise<ApiResponse> => {
      const res = await fetch(api.UPDATE_USER, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user?.accessToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      return resData;
    },
    onSuccess: (data) => {
      toast("Updated", {
        description: data.description,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      setEditingUser(null);
    },
    onError: (error) => {
      if (error && typeof error === "object" && "description" in error) {
        const backendError = error as { description: string };
        toast("Opss sorry but ...", {
          description: backendError.description,
          action: {
            label: "Close",
            onClick: () => console.log(""),
          },
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { handleSubmit: deleteUserHandleSubmit, reset: deleteUserReset } =
    useForm<UserForm>();

  useEffect(() => {
    if (deletingUser) {
      deleteUserReset({
        encrypted_id: deletingUser.encrypted_id,
      });
    }
  }, [deletingUser, deleteUserReset]);

  const deleteUser = deleteUserHandleSubmit((data: UserForm) => {
    deleteMutation.mutate(data);
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: UserForm): Promise<ApiResponse> => {
      const res = await fetch(api.DELETE_USER, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.accessToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      return resData;
    },
    onSuccess: (data) => {
      toast("Deleted", {
        description: data.description,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });

      deleteUserReset({
        encrypted_id: "",
      });

      setDeletingUser(null);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      setAddingUser(null);
    },
    onError: (error) => {
      if (error && typeof error === "object" && "description" in error) {
        const backendError = error as { description: string };
        toast("Opss sorry but ...", {
          description: backendError.description,
          action: {
            label: "Close",
            onClick: () => console.log(""),
          },
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
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
              {addingUser && (
                <Dialog
                  open={!!addingUser}
                  onOpenChange={() => setAddingUser(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add User</DialogTitle>
                      <DialogDescription>Fill in the details below to add a new user.</DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4 py-2" onSubmit={createUser}>
                      <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="Name"
                          {...createUserRegister("name", { required: true })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...createUserRegister("email", { required: true })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                            {...createUserRegister("password", {
                              required: true,
                            })}
                          />

                          <Button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-dark hover:bg-transparent"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {editingUser && (
                <Dialog
                  open={!!editingUser}
                  onOpenChange={() => setEditingUser(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>Edit the details below to update the user.</DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4 py-2" onSubmit={updateUser}>
                      <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="Name"
                          {...updateUserRegister("name", { required: true })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...updateUserRegister("email", { required: true })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                            {...updateUserRegister("password", {
                              required: false,
                            })}
                          />

                          <Button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-dark hover:bg-transparent"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? "Updating..." : "Update"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {deletingUser && (
                <Dialog
                  open={!!deletingUser}
                  onOpenChange={() => setDeletingUser(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>

                    <form className="space-y-4 py-2" onSubmit={deleteUser}>
                      <DialogDescription>
                        Are you sure you want to delete this employee? This
                        action cannot be undone.
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              <div className="flex justify-between mb-4">
                <Label>
                  <UsersIcon className="w-5" />
                  List of Users
                </Label>
                <Button onClick={() => setAddingUser(true)} size="sm">
                  <small> + Add</small>
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <SkeletonTable />
                        </TableCell>
                      </TableRow>
                    )}

                    {users.map((user: User, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <FormattedDate
                            date={user.updated_at}
                            variant="datetime"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="text-[12px]"
                              variant="secondary"
                              onClick={() => setEditingUser(user)}
                            >
                              <PencilIcon />
                            </Button>
                            <Button
                              size="sm"
                              className="text-[12px] text-red-600"
                              variant="secondary"
                              onClick={() => setDeletingUser(user)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
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
