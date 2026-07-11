import { api } from "@/lib/api";

import type { Trip } from "@/types/trip";

export const TripApi = {
  getTrips() {
    return api<Trip[]>("/trips");
  },

  getTrip(id: string) {
    return api<Trip>(`/trips/${id}`);
  },
};
