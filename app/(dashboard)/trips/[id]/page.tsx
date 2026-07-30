"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";

import TripMap from "@/components/map/tripmap";
import DayTabs from "@/components/trip/day-tabs";
import DayPanel from "@/components/trip/day-panel";
import MemberList from "@/components/trip/member-list";
import ActivityLog from "@/components/trip/activity-log";
import { useTrip } from "@/hooks/use-trips";
import { useOptimizeRoute, useReorderPlaces } from "@/hooks/use-places";
import { useDays, useCreateDay } from "@/hooks/use-trip-days";
import { useTripChannel } from "@/hooks/use-trip-channel";
import { Button } from "@/components/ui/button";
import { CreatePlaceDialog } from "@/components/place/create-place-dialog";

export default function TripPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: trip, isPending: tripLoading } = useTrip(id);
  const { data: days = [], isPending: daysLoading } = useDays(id);
  const createDayMutation = useCreateDay(id);

  useTripChannel(id);

  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0] ?? null;

  const optimizeMutation = useOptimizeRoute(id, activeDay?.id);
  const reorderMutation = useReorderPlaces(id, activeDay?.id);

  const handleReorder = useCallback(
    (orders: { id: string; visitOrder: number }[]) => {
      reorderMutation.mutate(orders);
    },
    [reorderMutation]
  );

  const handleAddDay = useCallback(() => {
    createDayMutation.mutate(undefined, {
      onSuccess: (newDay) => {
        setActiveDayId(newDay.id);
      },
    });
  }, [createDayMutation]);

  if (tripLoading || daysLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <Image
          src="/assets/illustrations/loading-trip.svg"
          width={192}
          height={192}
          alt="loading-trip"
        />
        <p className="text-sm text-muted-foreground">Loading trip...</p>
      </div>
    );
  }

  if (!trip) {
    return <p className="p-8">Trip not found.</p>;
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:space-y-8 sm:p-8">
      <section>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold sm:text-4xl">{trip.title}</h1>
        <TripMap tripId={trip.id} places={activeDay?.places ?? []} />
        {trip.description && (
          <p className="mt-3 text-muted-foreground">{trip.description}</p>
        )}

        {(trip.startDate || trip.endDate) && (
          <p className="mt-4 text-sm text-muted-foreground">
            {trip.startDate && new Date(trip.startDate).toLocaleDateString()}{" "}
            {trip.endDate && `— ${new Date(trip.endDate).toLocaleDateString()}`}
          </p>
        )}
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 min-w-0 space-y-8">
          <section>
            <DayTabs
              days={days}
              activeDayId={activeDay?.id ?? null}
              onDayChange={setActiveDayId}
              onAddDay={handleAddDay}
              isAdding={createDayMutation.isPending}
            />
          </section>

          {activeDay ? (
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {activeDay.title ?? `Day ${activeDay.dayNumber}`}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={
                      !activeDay.places.length || optimizeMutation.isPending
                    }
                    onClick={() => optimizeMutation.mutate()}
                  >
                    {optimizeMutation.isPending ? "Optimizing..." : "Optimize"}
                  </Button>
                  <CreatePlaceDialog tripId={id} dayId={activeDay.id} />
                </div>
              </div>

              <DayPanel places={activeDay.places} onReorder={handleReorder} />
            </section>
          ) : (
            <section className="py-12 text-center">
              <p className="text-muted-foreground">
                No days yet. Add a day to get started.
              </p>
              <Button
                className="mt-4"
                onClick={handleAddDay}
                disabled={createDayMutation.isPending}
              >
                {createDayMutation.isPending ? "Adding..." : "Add Day"}
              </Button>
            </section>
          )}
        </div>

        <aside className="w-full shrink-0 space-y-6 lg:w-72">
          <MemberList trip={trip} />
          <ActivityLog tripId={id} />
        </aside>
      </div>
    </main>
  );
}
