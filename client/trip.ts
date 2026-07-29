import { api } from "@/lib/api";

import type { PaginatedTrips, Trip } from "@/src/types/trip";
import type { CreateTripInput, UpdateTripInput } from "@/src/schemas/trip";

export const TripApi = {
  getTrips(params?: { page?: number; limit?: number; q?: string }) {
    const search = new URLSearchParams();
    if (params) {
      search.set("page", String(params.page ?? 1));
      search.set("limit", String(params.limit ?? 9));
      if (params.q) search.set("q", params.q);
    }
    const query = search.toString() ? `?${search.toString()}` : "";
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
