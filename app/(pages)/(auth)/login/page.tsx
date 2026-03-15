"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "./layouts/auth-layout";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: LoginForm) {
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthLayout
      title="NextJS Template"
      description="Enter your credentials below to log in"
    >
      <div className="space-y-5">
        {error && <p className="text-sm text-red-500">{error}</p>}

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
              placeholder="Enter password"
              {...register("password", { required: true })}
            />

            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-dark hover:bg-transparent"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </AuthLayout>
  );
}
