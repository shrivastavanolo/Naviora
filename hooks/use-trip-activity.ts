import { useQuery } from "@tanstack/react-query";
import { ActivityApi } from "@/client/activity";

export function useTripActivity(tripId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["trip-activity", tripId, page, limit],
    queryFn: () => ActivityApi.getLogs(tripId, page, limit),
    enabled: !!tripId,
  });
}
