"use client";

import { useMe } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { data: user } = useMe();

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
    </div>
  );
}
