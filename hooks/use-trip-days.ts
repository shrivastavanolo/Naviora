import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TripDayApi } from "@/client/trip-day";

export function useDays(tripId: string) {
  return useQuery({
    queryKey: ["trip-days", tripId],
    queryFn: () => TripDayApi.getDays(tripId),
    enabled: !!tripId,
  });
}

export function useCreateDay(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => TripDayApi.createDay(tripId, title),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-days", tripId] });
    },
  });
}


