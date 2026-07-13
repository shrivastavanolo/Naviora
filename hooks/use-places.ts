import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { PlaceApi } from "@/client/place";
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
