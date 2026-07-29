export interface Place {
  id: string;

  name: string;
  address: string | null;

  latitude: number;
  longitude: number;

  notes: string | null;

  visitOrder: number;

  estimatedDuration: number | null;

  tripId: string;
  dayId: string | null;

  createdAt: string;
  updatedAt: string;
}
