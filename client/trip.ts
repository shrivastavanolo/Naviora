import { api } from "@/lib/api";

import type { PaginatedTrips, Trip } from "@/src/types/trip";
import type { CreateTripInput, UpdateTripInput } from "@/src/schemas/trip";

export const TripApi = {
  getTrips(params?: { page?: number; limit?: number }) {
    const query = params
      ? `?${new URLSearchParams({ page: String(params.page ?? 1), limit: String(params.limit ?? 9) })}`
      : "";
    return api<PaginatedTrips>(`/trips${query}`);
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
