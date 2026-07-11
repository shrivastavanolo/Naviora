"use client";

import Link from "next/link";

import type { Trip } from "@/types/trip";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  trip: Trip;
}

export function TripCard({ trip }: Props) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="transition hover:shadow-md">
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
      </Card>
    </Link>
  );
}
