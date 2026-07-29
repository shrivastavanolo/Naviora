import { prisma } from "@/src/lib/prisma";
import type { Prisma } from "@prisma/client";

export class ActivityLogRepository {
  static create(data: {
    tripId: string;
    userId: string;
    action: string;
    details?: Record<string, unknown>;
  }) {
    return prisma.activityLog.create({
      data: {
        tripId: data.tripId,
        userId: data.userId,
        action: data.action,
        details: data.details as Prisma.InputJsonValue ?? undefined,
      },
    });
  }

  static findByTrip(tripId: string, page = 1, limit = 20) {
    return prisma.activityLog.findMany({
      where: { tripId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  static countByTrip(tripId: string) {
    return prisma.activityLog.count({ where: { tripId } });
  }
}
