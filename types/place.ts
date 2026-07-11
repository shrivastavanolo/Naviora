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

  createdAt: string;
  updatedAt: string;
}
