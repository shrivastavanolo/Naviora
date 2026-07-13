import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TripApi.createTrip,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
}
