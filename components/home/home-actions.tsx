"use client";

import Link from "next/link";
import { useMe } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CreateTripDialog } from "@/components/trip/create-trip-dialog";

export function HomeActions() {
  const { data: user, isPending } = useMe();
  const isAuthenticated = !!user;

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-11 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-11 w-24 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Link href="/dashboard">
          <Button size="lg" variant="accent" className="w-full min-w-30">
            Dashboard
          </Button>
        </Link>
        <div className="sm:w-auto">
          <CreateTripDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Link href="/signup">
        <Button size="lg" variant="accent" className="w-full min-w-30">
          Get Started
        </Button>
      </Link>
      <Link href="/login">
        <Button variant="outline" size="lg" className="w-full min-w-30">
          Login
        </Button>
      </Link>
    </div>
  );
}
