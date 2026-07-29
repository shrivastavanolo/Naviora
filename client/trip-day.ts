import { api } from "@/lib/api";
import type { TripDay } from "@/src/types/trip-day";

export const TripDayApi = {
  getDays(tripId: string) {
    return api<TripDay[]>(`/trips/${tripId}/days`);
  },

  createDay(tripId: string, title?: string) {
    return api<TripDay>(`/trips/${tripId}/days`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  updateDay(tripId: string, dayId: string, data: { title?: string | null }) {
    return api<TripDay>(`/trips/${tripId}/days/${dayId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteDay(tripId: string, dayId: string) {
    return api(`/trips/${tripId}/days/${dayId}`, {
      method: "DELETE",
    });
  },
};
