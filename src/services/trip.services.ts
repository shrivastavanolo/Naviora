import { NotFoundError, ForbiddenError } from "@/src/lib/errors";
import { TripRepository } from "@/src/repositories/trip.repository";
import { TripDayRepository } from "@/src/repositories/trip-day.repository";
import type { CreateTripInput, UpdateTripInput } from "@/src/schemas/trip";

export class TripService {
  static async createTrip(userId: string, data: CreateTripInput) {
    const trip = await TripRepository.create({
      ...data,
      ownerId: userId,
    });

    await TripDayRepository.create({
      dayNumber: 1,
      title: "Day 1",
      tripId: trip.id,
    });

    return trip;
  }

  static async getTrip(userId: string, tripId: string) {
    const trip = await TripRepository.findById(tripId);

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    const isMember = trip.members.some((member) => member.userId === userId);

    if (!isMember) {
      throw new ForbiddenError("You don't have access to this trip");
    }

    return trip;
  }

  static async getMyTrips(userId: string) {
    return TripRepository.findManyByUser(userId);
  }

  static async updateTrip(
    userId: string,
    tripId: string,
    data: UpdateTripInput
  ) {
    const trip = await TripRepository.findById(tripId);

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.ownerId !== userId) {
      throw new ForbiddenError("Only the trip owner can update this trip");
    }

    return TripRepository.update(tripId, data);
  }

  static async deleteTrip(userId: string, tripId: string) {
    const trip = await TripRepository.findById(tripId);

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.ownerId !== userId) {
      throw new ForbiddenError("Only the trip owner can delete this trip");
    }

    return TripRepository.delete(tripId);
  }
}
