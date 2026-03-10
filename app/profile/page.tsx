"use client";

import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ApiResponse } from "@/types";
import { SkeletonDelay } from "@/components/ui/skeleton-delay";
import { SkeletonCard } from "@/components/skeleton-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ProfileForm {
  encrypted_id: string;
  name: string;
  email: string;
  password?: string;
}

export default function ProfilePage() {
  const { user, updateSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue } = useForm<ProfileForm>();

  useEffect(() => {
    if (user?.email && user?.encrypted_id) {
      setValue("encrypted_id", user.encrypted_id);
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const updateProfile = (data: ProfileForm) => {
    updateMutation.mutate(data);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileForm): Promise<ApiResponse> => {
      const res = await fetch("/api/profile", {
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

      updateSession({
        user: {
          ...data.user,
        },
      });
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
          <Navbar title="Profile" />

          <main className="p-6 flex justify-center items-start">
            <SkeletonDelay skeleton={<SkeletonCard />}>
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Update Your Profile</CardTitle>
                  <CardDescription>
                    Change your email or password
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={handleSubmit(updateProfile)}
                    className="space-y-5"
                  >
                    <div className="grid gap-2">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        placeholder="Name"
                        {...register("name", { required: true })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...register("email", { required: true })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          {...register("password", { required: false })}
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

                    <Button
                      className="w-full"
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Updating..." : "Update"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </SkeletonDelay>
          </main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
