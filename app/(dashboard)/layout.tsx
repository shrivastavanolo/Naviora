"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/ui/spinner";
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
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return children;
}
