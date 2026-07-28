"use client";

import { useTrips } from "@/hooks/use-trips";
import { TripCard } from "@/components/trip/trip-card";
import { CreateTripDialog } from "@/components/trip/create-trip-dialog";

export default function DashboardPage() {
  const { data: trips, isPending, error } = useTrips();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">Failed to load trips.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Trips
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {trips?.length
              ? `You have ${trips.length} trip${trips.length === 1 ? "" : "s"} planned.`
              : "Plan and organize your next adventure."}
          </p>
        </div>
        <CreateTripDialog />
      </div>

      {!trips?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-20">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="size-7 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">No trips yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first trip to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
