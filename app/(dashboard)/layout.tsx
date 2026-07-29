"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data, isPending, isError } = useMe();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isPending) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <img
          src="/assets/illustrations/loading-trip.svg"
          alt="Loading"
          className="size-48"
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return children;
}
