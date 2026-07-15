"use client";

import { useParams } from "next/navigation";

import TripMap from "@/components/map/tripmap";
import { useTrip } from "@/hooks/use-trips";
import { usePlaces } from "@/hooks/use-places";
import { CreatePlaceDialog } from "@/components/place/create-place-dialog";
import { EditPlaceDialog } from "@/components/place/edit-place-dialog";
import { DeletePlaceDialog } from "@/components/place/delete-place-dialog";

export default function TripPage() {
  const { id } = useParams<{ id: string }>();

  const { data: trip, isPending: tripLoading } = useTrip(id);

  const { data: places, isPending: placesLoading } = usePlaces(id);

  if (tripLoading || placesLoading) {
    return <p className="p-8">Loading...</p>;
  }

  if (!trip) {
    return <p className="p-8">Trip not found.</p>;
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      <section>
        <h1 className="text-4xl font-bold">{trip.title}</h1>
        <TripMap tripId={trip.id} />
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

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Places</h2>
        <CreatePlaceDialog tripId={id}></CreatePlaceDialog>

        {!places?.length ? (
          <p className="text-muted-foreground">No places yet.</p>
        ) : (
          <div className="space-y-3">
            {places.map((place) => (
              <div key={place.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{place.name}</h3>

                {place.address && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {place.address}
                  </p>
                )}
                <EditPlaceDialog place={place}></EditPlaceDialog>
                <DeletePlaceDialog
                  placeId={place.id}
                  tripId={place.tripId}
                  placeName={place.name}
                ></DeletePlaceDialog>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
