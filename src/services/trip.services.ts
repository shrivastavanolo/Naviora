import { NotFoundError, ForbiddenError } from "@/src/lib/errors";
import { TripRepository } from "@/src/repositories/trip.repository";
import { TripDayRepository } from "@/src/repositories/trip-day.repository";
import { TripMemberRepository } from "@/src/repositories/trip-member.repository";
import { ActivityLogService } from "@/src/services/activity-log.services";
import { NotificationService } from "@/src/services/notification.services";
import { broadcastTripUpdate } from "@/lib/broadcast";
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

  static async getMyTrips(userId: string, page = 1, limit = 9) {
    const [trips, total] = await Promise.all([
      TripRepository.findManyByUser(userId, page, limit),
      TripRepository.countByUser(userId),
    ]);

    return {
      trips,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

    const updated = await TripRepository.update(tripId, data);
    await ActivityLogService.log(tripId, userId, "trip_updated", {
      changes: Object.keys(data),
    });
    await broadcastTripUpdate(tripId, "trip:updated", {});

    const otherMembers = trip.members.filter((m) => m.userId !== userId);
    for (const member of otherMembers) {
      await NotificationService.create({
        userId: member.userId,
        actorId: userId,
        type: "trip_updated",
        tripId,
        title: `Trip "${trip.title}" was updated`,
        body: null,
        data: null,
      });
    }

    return updated;
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

  static async removeMember(userId: string, tripId: string, memberId: string) {
    const trip = await TripRepository.findById(tripId);

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.ownerId !== userId) {
      throw new ForbiddenError("Only the trip owner can remove members");
    }

    if (memberId === userId) {
      throw new ForbiddenError("You cannot remove yourself as owner");
    }

    await TripMemberRepository.remove(tripId, memberId);

    await ActivityLogService.log(tripId, userId, "member_removed", {
      targetUserId: memberId,
    });

    await broadcastTripUpdate(tripId, "trip:updated", {});

    await NotificationService.create({
      userId: memberId,
      actorId: userId,
      type: "member_removed",
      tripId,
      title: `You were removed from "${trip.title}"`,
      body: null,
      data: null,
    });

    return { success: true };
  }
}
