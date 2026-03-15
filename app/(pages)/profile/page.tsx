"use client";

import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";
import { useAuth } from "@/lib/auth/session/client-use-auth";
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
import { api } from "@/lib/api/endpoints";
import { handleApiError } from "@/lib/exceptions/handle-api-error";
import axios from "axios";
import Footer from "@/components/footer";

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
      if (!user?.accessToken) {
        throw new Error("User not authenticated");
      }

      const res = await axios.patch(api.UPDATE_PROFILE, data, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      return res.data;
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

    onError: handleApiError,
  });

  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Profile" />

          <main className="p-6">
            <SkeletonDelay skeleton={<SkeletonCard />}>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* LEFT COLUMN - PROFILE MENU */}
                <div className="md:col-span-1 border-r pr-6">
                  <h2 className="text-lg font-semibold mb-4">Settings</h2>

                  <ul className="space-y-2 text-sm">
                    <li className="font-semibold text-primary border-l-2 border-primary pl-3 py-1">
                      Profile
                    </li>

                    <li className="text-gray-500 pl-3 py-1 hover:text-gray-700 cursor-pointer">
                      Security
                    </li>

                    <li className="text-gray-500 pl-3 py-1 hover:text-gray-700 cursor-pointer">
                      Notifications
                    </li>
                  </ul>

                  <div className="mt-8 text-xs text-gray-500">
                    Manage your personal account information.
                  </div>
                </div>

                {/* RIGHT COLUMN - PROFILE FORM */}
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h1 className="text-xl font-semibold">Profile</h1>
                    <p className="text-sm text-gray-500">
                      Update your name, email, or password.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(updateProfile)}
                    className="space-y-6 max-w-md"
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
                      <Label>Password</Label>

                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          {...register("password")}
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

                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending
                        ? "Updating..."
                        : "Update Profile"}
                    </Button>
                  </form>
                </div>
              </div>
            </SkeletonDelay>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
