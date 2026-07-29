import { api } from "@/lib/api";

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string | null;
  actor: { id: string; name: string; avatar: string | null } | null;
  type: string;
  tripId: string | null;
  trip: { id: string; title: string } | null;
  title: string;
  body: string | null;
  read: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  total: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const NotificationApi = {
  getNotifications(page = 1, limit = 20) {
    return api<NotificationsResponse>(
      `/notifications?page=${page}&limit=${limit}`
    );
  },

  getUnreadCount() {
    return api<UnreadCountResponse>("/notifications/unread");
  },

  markAsRead(id: string) {
    return api(`/notifications/${id}`, { method: "PATCH" });
  },

  markAllAsRead() {
    return api("/notifications/read-all", { method: "POST" });
  },
};
