"use client";

import { useRouter } from "next/navigation";

import type { Trip } from "@/types/trip";

import { Card, CardContent } from "@/components/ui/card";
import { EditTripDialog } from "./edit-trip-dialog";
import { DeleteTripDialog } from "./delete-trip-dialog";

interface Props {
  trip: Trip;
}

export function TripCard({ trip }: Props) {
  const router = useRouter();
  return (
    <Card className="transition hover:shadow-md">
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/trips/${trip.id}`)}
      >
        <CardContent className="space-y-2 p-6">
          <h2 className="text-xl font-semibold">{trip.title}</h2>

          {trip.description && (
            <p className="text-muted-foreground">{trip.description}</p>
          )}

          <p className="text-sm text-muted-foreground">
            {trip.startDate
              ? new Date(trip.startDate).toLocaleDateString()
              : "No dates"}
          </p>
        </CardContent>
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EditTripDialog trip={trip} />
        <DeleteTripDialog tripId={trip.id} title={trip.title} />
      </div>
    </Card>
  );
}
