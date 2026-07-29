"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/lib/pusher-client";
import { useMe } from "@/hooks/use-auth";

export function useNotificationChannel() {
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  useEffect(() => {
    if (!user?.id) return;

    const channel = pusherClient.subscribe(`notification-${user.id}`);

    const handleNew = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    };

    channel.bind("notification:new", handleNew);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`notification-${user.id}`);
    };
  }, [user?.id, queryClient]);
}
