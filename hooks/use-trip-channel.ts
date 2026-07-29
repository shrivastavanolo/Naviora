"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/lib/pusher-client";

export function useTripChannel(tripId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tripId) return;

    const channel = pusherClient.subscribe(`trip-${tripId}`);

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["trip-days", tripId] });
      queryClient.invalidateQueries({ queryKey: ["places", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trip-activity", tripId] });
    };

    channel.bind("place:added", invalidate);
    channel.bind("place:updated", invalidate);
    channel.bind("place:deleted", invalidate);
    channel.bind("places:reordered", invalidate);
    channel.bind("day:added", invalidate);
    channel.bind("day:updated", invalidate);
    channel.bind("day:deleted", invalidate);
    channel.bind("trip:updated", invalidate);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`trip-${tripId}`);
    };
  }, [tripId, queryClient]);
}
