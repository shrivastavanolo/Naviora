import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { NotificationApi } from "@/client/notification";

export function useNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["notifications", { page, limit }],
    queryFn: () => NotificationApi.getNotifications(page, limit),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: NotificationApi.getUnreadCount,
    refetchInterval: 30_000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NotificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}
