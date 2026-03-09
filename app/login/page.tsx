"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

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
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  {...register("password", { required: true })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
