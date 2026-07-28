"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { AuthApi } from "@/client/auth";
import { useMe } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { data: user, isSuccess: isAuthenticated } = useMe();

  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight hover:text-primary transition-colors"
        >
          Naviora
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
