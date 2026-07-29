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

export function useUpdateDay(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dayId, title }: { dayId: string; title?: string | null }) =>
      TripDayApi.updateDay(tripId, dayId, { title }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-days", tripId] });
    },
  });
}

export function useDeleteDay(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayId: string) => TripDayApi.deleteDay(tripId, dayId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-days", tripId] });
    },
  });
}
