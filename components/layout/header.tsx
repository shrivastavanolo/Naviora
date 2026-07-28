"use client";

import Link from "next/link";
import Image from "next/image";
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
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Naviora"
            width={120}
            height={120}
            priority
          />
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
              <Button size="sm" onClick={() => router.push("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
