import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TripApi } from "@/client/trip";
import { UpdateTripInput } from "@/src/schemas/trip";
import type { PaginatedTrips } from "@/src/types/trip";

export function useTrips(q?: string, limit = 9) {
  return useInfiniteQuery({
    queryKey: ["trips", { limit, q }],
    queryFn: ({ pageParam }) => TripApi.getTrips({ page: pageParam, limit, q }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedTrips) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    placeholderData: (previousData) => previousData,
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

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: UpdateTripInput }) =>
      TripApi.updateTrip(tripId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => TripApi.deleteTrip(tripId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
}
