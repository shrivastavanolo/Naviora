import { api } from "@/lib/api";

import type { Place } from "@/types/place";
import type { CreatePlaceInput } from "@/src/schemas/place";

export const PlaceApi = {
  getPlaces(tripId: string) {
    return api<Place[]>(`/trips/${tripId}/places`);
  },

  getPlace(id: string) {
    return api<Place>(`/places/${id}`);
  },

  createPlace(tripId: string, data: CreatePlaceInput) {
    return api<Place>(`/trips/${tripId}/places`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
