import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { PlaceApi } from "@/client/place";
import type { Place } from "@/src/types/place";
import type { TripDay } from "@/src/types/trip-day";
import { CreatePlaceInput, UpdatePlaceInput } from "@/src/schemas/place";

export function usePlaces(tripId: string) {
  return useQuery({
    queryKey: ["places", tripId],
    queryFn: () => PlaceApi.getPlaces(tripId),
    enabled: !!tripId,
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ["place", id],
    queryFn: () => PlaceApi.getPlace(id),
    enabled: !!id,
  });
}

function invalidatePlaceQueries(queryClient: ReturnType<typeof useQueryClient>, tripId: string) {
  queryClient.invalidateQueries({ queryKey: ["places", tripId] });
  queryClient.invalidateQueries({ queryKey: ["trip-days", tripId] });
}

export function useCreatePlace(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaceInput) => PlaceApi.createPlace(tripId, data),

    onSuccess: () => {
      invalidatePlaceQueries(queryClient, tripId);
    },
  });
}

export function useUpdatePlace(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      placeId,
      data,
    }: {
      placeId: string;
      data: UpdatePlaceInput;
    }) => PlaceApi.updatePlace(placeId, data),

    onSuccess: () => {
      invalidatePlaceQueries(queryClient, tripId);
    },
  });
}

export function useDeletePlace(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: string) => PlaceApi.deletePlace(placeId),

    onSuccess: () => {
      invalidatePlaceQueries(queryClient, tripId);
    },
  });
}

export function useOptimizeRoute(tripId: string, dayId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PlaceApi.optimizeRoute(tripId, dayId),

    onSuccess: () => {
      invalidatePlaceQueries(queryClient, tripId);
    },
  });
}

export function useReorderPlaces(tripId: string, dayId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: { id: string; visitOrder: number }[]) =>
      PlaceApi.reorderPlaces(tripId, orders, dayId),

    onMutate: async (orders) => {
      await queryClient.cancelQueries({ queryKey: ["places", tripId] });
      const prevPlaces = queryClient.getQueryData<Place[]>(["places", tripId]);

      await queryClient.cancelQueries({ queryKey: ["trip-days", tripId] });
      const prevDays = queryClient.getQueryData<TripDay[]>(["trip-days", tripId]);

      const sortedIds = [...orders].sort((a, b) => a.visitOrder - b.visitOrder).map((o) => o.id);

      if (prevPlaces) {
        const sorted = [...orders].sort((a, b) => a.visitOrder - b.visitOrder);
        const updated = sorted.map((o) => ({
          ...prevPlaces.find((p) => p.id === o.id)!,
          visitOrder: o.visitOrder,
        }));
        queryClient.setQueryData(["places", tripId], updated);
      }

      if (prevDays && dayId) {
        const updatedDays = prevDays.map((day) => {
          if (day.id !== dayId) return day;
          const reordered = [...day.places].sort(
            (a, b) => sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id)
          );
          return { ...day, places: reordered };
        });
        queryClient.setQueryData(["trip-days", tripId], updatedDays);
      }

      return { prevPlaces, prevDays };
    },

    onError: (_err, _orders, context) => {
      if (context?.prevPlaces) {
        queryClient.setQueryData(["places", tripId], context.prevPlaces);
      }
      if (context?.prevDays) {
        queryClient.setQueryData(["trip-days", tripId], context.prevDays);
      }
    },

    onSettled: () => {
      invalidatePlaceQueries(queryClient, tripId);
    },
  });
}
