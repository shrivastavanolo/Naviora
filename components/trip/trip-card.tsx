"use client";

import { useRouter } from "next/navigation";

import type { Trip } from "@/src/types/trip";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EditTripDialog } from "./edit-trip-dialog";
import { DeleteTripDialog } from "./delete-trip-dialog";

interface Props {
  trip: Trip;
}

export function TripCard({ trip }: Props) {
  const router = useRouter();

  const hasDates = trip.startDate || trip.endDate;

  return (
    <Card
      size="sm"
      className="group relative flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
      onClick={() => router.push(`/trips/${trip.id}`)}
    >
      <CardContent className="flex flex-1 flex-col gap-3 pt-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold leading-snug text-foreground line-clamp-1">
            {trip.title}
          </h2>

          {trip.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {trip.description}
            </p>
          )}
        </div>

        {hasDates && (
          <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span>
              {trip.startDate
                ? new Date(trip.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}
              {trip.startDate && trip.endDate ? " — " : ""}
              {trip.endDate
                ? new Date(trip.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="justify-end gap-1"
      >
        <EditTripDialog trip={trip} />
        <DeleteTripDialog tripId={trip.id} title={trip.title} />
      </CardFooter>
    </Card>
  );
}
