import { NotFoundError, ForbiddenError } from "@/src/lib/errors";
import { TripDayRepository } from "@/src/repositories/trip-day.repository";
import { TripRepository } from "@/src/repositories/trip.repository";
import { ActivityLogService } from "@/src/services/activity-log.services";
import { broadcastTripUpdate } from "@/lib/broadcast";

export class TripDayService {
  private static async requireTripAccess(userId: string, tripId: string) {
    const trip = await TripRepository.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found");
    const isMember = trip.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenError("You don't have access to this trip");
    return trip;
  }

  static async getDays(userId: string, tripId: string) {
    await this.requireTripAccess(userId, tripId);
    return TripDayRepository.findByTrip(tripId);
  }

  static async createDay(userId: string, tripId: string, title?: string) {
    await this.requireTripAccess(userId, tripId);
    const dayNumber = await TripDayRepository.getNextDayNumber(tripId);
    const day = await TripDayRepository.create({ dayNumber, title: title ?? `Day ${dayNumber}`, tripId });
    await ActivityLogService.log(tripId, userId, "day_created", {
      dayId: day.id,
      title: day.title,
      dayNumber,
    });
    await broadcastTripUpdate(tripId, "day:added", { dayId: day.id });
    return day;
  }

  static async updateDay(userId: string, dayId: string, data: { title?: string | null }) {
    const day = await TripDayRepository.findById(dayId);
    if (!day) throw new NotFoundError("Day not found");
    await this.requireTripAccess(userId, day.tripId);
    const updated = await TripDayRepository.update(dayId, data);
    await ActivityLogService.log(day.tripId, userId, "day_updated", {
      dayId,
      oldTitle: day.title,
      newTitle: data.title,
    });
    await broadcastTripUpdate(day.tripId, "day:updated", { dayId });
    return updated;
  }

  static async deleteDay(userId: string, dayId: string) {
    const day = await TripDayRepository.findById(dayId);
    if (!day) throw new NotFoundError("Day not found");
    await this.requireTripAccess(userId, day.tripId);
    await ActivityLogService.log(day.tripId, userId, "day_deleted", {
      dayId,
      title: day.title,
      dayNumber: day.dayNumber,
    });
    await broadcastTripUpdate(day.tripId, "day:deleted", { dayId });
    return TripDayRepository.delete(dayId);
  }
}
