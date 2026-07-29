import type { Place } from "./place";

export interface TripDay {
  id: string;
  dayNumber: number;
  title: string | null;
  tripId: string;
  places: Place[];
}
