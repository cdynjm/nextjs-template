"use client";

import { useState } from "react";
import SessionGuard from "@/components/auth/session-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/session/client-use-auth";
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
import { query_keys } from "@/lib/queries/query-keys";
import { Eye, EyeOff, PencilIcon, TrashIcon, UsersIcon } from "lucide-react";
import axios from "axios";
import { handleApiError } from "@/lib/exceptions/handle-api-error";
import Pagination from "@/components/pagination";
import { Page, Limit } from "@/lib/helpers/pagination";
import Footer from "@/components/footer";
interface UserForm {
  encrypted_id: string;
  name: string;
  email: string;
  password?: string;
}

export default function UsersPage() {
  const { user, updateSession } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(Page);
  const limit = Limit;

  const { data, isLoading } = useQuery({
    queryKey: [query_keys.USERS, page],
    enabled: !!user?.accessToken,
    queryFn: async () => {
      const res = await axios.get(api.GET_USERS, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const [addingUser, setAddingUser] = useState<boolean | null>(null);

  const { register: createUserRegister, handleSubmit: createUserHandleSubmit } =
    useForm<UserForm>();

  const createUser = createUserHandleSubmit((data: UserForm) => {
    createMutation.mutate(data);
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserForm): Promise<ApiResponse> => {
      if (!user?.accessToken) {
        throw new Error("User not authenticated");
      }

      const res = await axios.post(api.CREATE_USER, data, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: (data) => {
      toast("Created", {
        description: data.description,
        action: { label: "Close", onClick: () => {} },
      });

      queryClient.invalidateQueries({
        queryKey: [query_keys.USERS],
        exact: false,
      });
      setAddingUser(false);
    },

    onError: handleApiError,
  });

  const [editingUser, setEditingUser] = useState<boolean | null>(null);

  const {
    register: updateUserRegister,
    handleSubmit: updateUserHandleSubmit,
    reset: updateUserReset,
  } = useForm<UserForm>();

  const [showPassword, setShowPassword] = useState(false);

  const editUser = (user: User) => {
    updateUserReset({
      encrypted_id: user.encrypted_id,
      name: user.name,
      email: user.email,
      password: "",
    });

    setEditingUser(true);
  };

  const updateUser = updateUserHandleSubmit((data: UserForm) => {
    updateMutation.mutate(data);
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UserForm): Promise<ApiResponse> => {
      if (!user?.accessToken) {
        throw new Error("User not authenticated");
      }

      const res = await axios.patch(api.UPDATE_USER, data, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      toast("Updated", {
        description: data.description,
        action: { label: "Close", onClick: () => {} },
      });

      if (data.updateSession) {
        updateSession({
          user: {
            ...data.user,
          },
        });
      }

      queryClient.invalidateQueries({
        queryKey: [query_keys.USERS],
        exact: false,
      });
      setEditingUser(false);
    },
    onError: handleApiError,
  });

  const [deletingUser, setDeletingUser] = useState<boolean | null>(null);

  const { handleSubmit: deleteUserHandleSubmit, reset: deleteUserReset } =
    useForm<UserForm>();

  const removeUser = (user: User) => {
    deleteUserReset({
      encrypted_id: user.encrypted_id,
    });

    setDeletingUser(true);
  };

  const deleteUser = deleteUserHandleSubmit((data: UserForm) => {
    deleteMutation.mutate(data);
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: UserForm): Promise<ApiResponse> => {
      if (!user?.accessToken) {
        throw new Error("User not authenticated");
      }

      const res = await axios.delete(api.DELETE_USER, {
        data,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      toast("Deleted", {
        description: data.description,
        action: { label: "Close", onClick: () => {} },
      });

      queryClient.invalidateQueries({
        queryKey: [query_keys.USERS],
        exact: false,
      });
      setDeletingUser(false);
    },
    onError: handleApiError,
  });

  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Users" />
          <main className="p-6 flex-1">
            <SkeletonDelay skeleton={<SkeletonCard />}>
              <Dialog
                open={!!addingUser}
                onOpenChange={() => setAddingUser(false)}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new user.
                    </DialogDescription>
                  </DialogHeader>

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
                      onClick={createUser}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={!!editingUser}
                onOpenChange={() => setEditingUser(false)}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      Edit the details below to update the user.
                    </DialogDescription>
                  </DialogHeader>

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
                      onClick={updateUser}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Updating..." : "Update"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={!!deletingUser}
                onOpenChange={() => setDeletingUser(false)}
              >
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                  </DialogHeader>

                  <DialogDescription>
                    Are you sure you want to delete this employee? This action
                    cannot be undone.
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={deleteUser}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex justify-between mb-4">
                <Label>
                  <UsersIcon className="w-5" />
                  List of Users
                </Label>
                <Button onClick={() => setAddingUser(true)} size="sm">
                  <small> + Add</small>
                </Button>
              </div>

              <div className="rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <SkeletonTable />
                        </TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          <p className="p-2 text-gray-600">
                            Opss, sorry... no data found.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user: User, index: number) => (
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
                                onClick={() => editUser(user)}
                              >
                                <PencilIcon />
                              </Button>
                              <Button
                                size="sm"
                                className="text-[12px] text-red-600"
                                variant="secondary"
                                onClick={() => removeUser(user)}
                              >
                                <TrashIcon />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <Pagination
                  page={page}
                  totalPages={pagination?.totalPages ?? 1}
                  onPageChange={setPage}
                />
              </div>
            </SkeletonDelay>
          </main>
           <Footer />
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
