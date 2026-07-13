import { api } from "@/lib/api";

import type { Trip } from "@/types/trip";
import type { CreateTripInput } from "@/src/schemas/trip";

export const TripApi = {
  getTrips() {
    return api<Trip[]>("/trips");
  },

  getTrip(id: string) {
    return api<Trip>(`/trips/${id}`);
  },

  createTrip(data: CreateTripInput) {
    return api<Trip>("/trips", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
