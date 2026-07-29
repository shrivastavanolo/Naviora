"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { ArrowLeft } from "lucide-react";

import { loginSchema, type LoginInput } from "@/src/schemas/auth";
import { useLogin } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import { AuthDivider } from "@/components/auth/auth-divider";

export default function LoginPage() {
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["me"],
        });

        router.push("/dashboard");
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <main className="flex min-h-screen bg-muted/30">
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 lg:flex">
        <img
          src="/assets/illustrations/login-hero.svg"
          alt="Login"
          className="w-full"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 lg:w-1/2">
        <div className="w-full max-w-md mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login to Naviora</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-5">
              <GoogleButton />

              <AuthDivider />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Signing in..." : "Login"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
