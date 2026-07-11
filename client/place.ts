import { api } from "@/lib/api";

import type { Place } from "@/types/place";

export const PlaceApi = {
  getPlaces(tripId: string) {
    return api<Place[]>(`/trips/${tripId}/places`);
  },
};
