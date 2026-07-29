import { NotFoundError, ForbiddenError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import { ActivityLogRepository } from "@/src/repositories/activity-log.repository";

export class ActivityLogService {
  private static async requireTripAccess(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true },
    });
    if (!trip) throw new NotFoundError("Trip not found");
    const member = await prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });
    if (!member) throw new ForbiddenError("You don't have access to this trip");
  }

  static async getLogs(userId: string, tripId: string, page?: number, limit?: number) {
    await this.requireTripAccess(userId, tripId);
    const logs = await ActivityLogRepository.findByTrip(tripId, page, limit);
    const total = await ActivityLogRepository.countByTrip(tripId);
    return { logs, total, page: page ?? 1, limit: limit ?? 20 };
  }

  static async log(tripId: string, userId: string, action: string, details?: Record<string, unknown>) {
    return ActivityLogRepository.create({ tripId, userId, action, details });
  }
}
