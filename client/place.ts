import { api } from "@/lib/api";

import type { Place } from "@/types/place";
import type { CreatePlaceInput, UpdatePlaceInput } from "@/src/schemas/place";

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

  updatePlace(placeId: string, data: UpdatePlaceInput) {
    return api<Place>(`/places/${placeId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deletePlace(placeId: string) {
    return api(`/places/${placeId}`, {
      method: "DELETE",
    });
  },
};
