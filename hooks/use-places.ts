import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { PlaceApi } from "@/client/place";
import type { Place } from "@/src/types/place";
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

export function useCreatePlace(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaceInput) => PlaceApi.createPlace(tripId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["places", tripId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["places", tripId],
      });
    },
  });
}

export function useDeletePlace(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: string) => PlaceApi.deletePlace(placeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["places", tripId],
      });
    },
  });
}

export function useOptimizeRoute(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PlaceApi.optimizeRoute(tripId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["places", tripId],
      });
    },
  });
}

export function useReorderPlaces(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: { id: string; visitOrder: number }[]) =>
      PlaceApi.reorderPlaces(tripId, orders),

    onMutate: async (orders) => {
      await queryClient.cancelQueries({ queryKey: ["places", tripId] });
      const prev = queryClient.getQueryData<Place[]>(["places", tripId]);
      if (prev) {
        const sorted = [...orders].sort((a, b) => a.visitOrder - b.visitOrder);
        const updated = sorted.map((o) => ({
          ...prev.find((p) => p.id === o.id)!,
          visitOrder: o.visitOrder,
        }));
        queryClient.setQueryData(["places", tripId], updated);
      }
      return { prev };
    },

    onError: (_err, _orders, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["places", tripId], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["places", tripId] });
    },
  });
}
