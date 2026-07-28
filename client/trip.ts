import { api } from "@/lib/api";

import type { Trip } from "@/src/types/trip";
import type { CreateTripInput, UpdateTripInput } from "@/src/schemas/trip";

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

  updateTrip(tripId: string, data: UpdateTripInput) {
    return api<Trip>(`/trips/${tripId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteTrip(tripId: string) {
    return api(`/trips/${tripId}`, {
      method: "DELETE",
    });
  },
};
