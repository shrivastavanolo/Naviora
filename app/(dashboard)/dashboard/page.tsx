"use client";

import { useTrips } from "@/hooks/use-trips";

import { TripCard } from "@/components/trip/trip-card";

export default function DashboardPage() {
  const { data: trips, isPending, error } = useTrips();

  if (isPending) {
    return <p className="p-8">Loading trips...</p>;
  }

  if (error) {
    return <p className="p-8">Failed to load trips.</p>;
  }

  if (!trips?.length) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Your Trips</h1>

        <p className="mt-4 text-muted-foreground">
          You have not created any trips yet.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Your Trips</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </main>
  );
}
