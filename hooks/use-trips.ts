import { useQuery } from "@tanstack/react-query";

import { TripApi } from "@/client/trip";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: TripApi.getTrips,
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: () => TripApi.getTrip(id),
    enabled: !!id,
  });
}
