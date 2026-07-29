import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CreateNotificationData {
  userId: string;
  actorId?: string;
  type: string;
  tripId?: string;
  title: string;
  body?: string | null;
  data?: Record<string, unknown> | null;
}

export class NotificationRepository {
  static create(data: CreateNotificationData) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        actorId: data.actorId,
        type: data.type,
        tripId: data.tripId,
        title: data.title,
        body: data.body,
        data: (data.data as Prisma.JsonValue) ?? Prisma.JsonNull,
      },
    });
  }

  static findByUser(userId: string, page = 1, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        actor: { select: { id: true, name: true, avatar: true } },
        trip: { select: { id: true, title: true } },
      },
    });
  }

  static countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }

  static markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  static markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
