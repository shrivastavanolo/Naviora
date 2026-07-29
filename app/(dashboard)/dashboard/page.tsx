"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { useTrips } from "@/hooks/use-trips";
import { TripCard } from "@/components/trip/trip-card";
import { CreateTripDialog } from "@/components/trip/create-trip-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/spinner";

export default function DashboardPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTrips(searchQuery || undefined);

  const allTrips = useMemo(
    () => data?.pages.flatMap((p) => p.trips) ?? [],
    [data]
  );
  const total = data?.pages[0]?.total ?? 0;

  if (isPending) {
    return <LoadingSpinner />;
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
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Trips
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total
              ? `You have ${total} trip${total === 1 ? "" : "s"} planned.`
              : "Plan and organize your next adventure."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trips..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9 w-48 pl-9 text-sm"
            />
          </div>
          <CreateTripDialog />
        </div>
      </div>

      {!allTrips.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-20">
          <img
            src="/assets/illustrations/empty-trip.svg"
            alt="No trips"
            className="mb-4 size-40"
          />
          <h2 className="text-lg font-semibold">No trips yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first trip to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {searchQuery && !allTrips.length && (
            <div className="flex flex-col items-center py-16">
              <img
                src="/assets/illustrations/empty-search.svg"
                alt="No results"
                className="size-36"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                No trips match &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}
        </>
      )}

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
