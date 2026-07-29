import { NotFoundError } from "@/src/lib/errors";
import { NotificationRepository } from "@/src/repositories/notification.repository";
import { broadcastUserNotification } from "@/lib/broadcast";
import type { CreateNotificationData } from "@/src/repositories/notification.repository";

export class NotificationService {
  static async create(data: CreateNotificationData) {
    const notification = await NotificationRepository.create(data);

    try {
      await broadcastUserNotification(data.userId, notification);
    } catch {
      // fire-and-forget
    }

    return notification;
  }

  static async getNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      NotificationRepository.findByUser(userId, page, limit),
      NotificationRepository.countUnread(userId),
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { notifications, unreadCount, total };
  }

  static async getUnreadCount(userId: string) {
    const count = await NotificationRepository.countUnread(userId);
    return { count };
  }

  static async markAsRead(userId: string, notificationId: string) {
    const result = await NotificationRepository.markAsRead(notificationId, userId);

    if (result.count === 0) {
      throw new NotFoundError("Notification not found");
    }

    return { success: true };
  }

  static async markAllAsRead(userId: string) {
    await NotificationRepository.markAllAsRead(userId);
    return { success: true };
  }
}
