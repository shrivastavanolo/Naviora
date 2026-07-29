import { NotFoundError, ForbiddenError } from "@/src/lib/errors";
import { TripDayRepository } from "@/src/repositories/trip-day.repository";
import { TripRepository } from "@/src/repositories/trip.repository";

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
    return TripDayRepository.create({ dayNumber, title: title ?? `Day ${dayNumber}`, tripId });
  }

  static async updateDay(userId: string, dayId: string, data: { title?: string | null }) {
    const day = await TripDayRepository.findById(dayId);
    if (!day) throw new NotFoundError("Day not found");
    await this.requireTripAccess(userId, day.tripId);
    return TripDayRepository.update(dayId, data);
  }

  static async deleteDay(userId: string, dayId: string) {
    const day = await TripDayRepository.findById(dayId);
    if (!day) throw new NotFoundError("Day not found");
    await this.requireTripAccess(userId, day.tripId);
    return TripDayRepository.delete(dayId);
  }
}
