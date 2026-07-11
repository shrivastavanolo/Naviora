import { useQuery } from "@tanstack/react-query";

import { PlaceApi } from "@/client/place";

export function usePlaces(tripId: string) {
  return useQuery({
    queryKey: ["places", tripId],
    queryFn: () => PlaceApi.getPlaces(tripId),
    enabled: !!tripId,
  });
}
