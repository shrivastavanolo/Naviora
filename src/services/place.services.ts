import { NotFoundError, ForbiddenError } from "@/src/lib/errors";
import { PlaceRepository } from "@/src/repositories/place.repository";
import type { CreatePlaceInput, UpdatePlaceInput } from "@/src/schemas/place";
import { TripRepository } from "../repositories/trip.repository";

export class PlaceService {
  private static async requirePlace(placeId: string) {
    const place = await PlaceRepository.findById(placeId);

    if (!place) {
      throw new NotFoundError("Place not found");
    }
    return place;
  }

  private static async requireTripAccess(userId: string, tripId: string) {
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

  static async createPlace(
    userId: string,
    tripId: string,
    data: CreatePlaceInput & { dayId?: string }
  ) {
    const trip = await this.requireTripAccess(userId, tripId);
    const nextVisitOrder = await PlaceRepository.getNextVisitOrder(tripId, data.dayId);

    return PlaceRepository.create({
      ...data,
      visitOrder: nextVisitOrder + 1,
      tripId: trip.id,
    });
  }

  static async getPlace(userId: string, placeId: string) {
    const place = await this.requirePlace(placeId);
    await this.requireTripAccess(userId, place.tripId);

    return place;
  }

  static async getTripPlaces(userId: string, tripId: string) {
    await this.requireTripAccess(userId, tripId);
    return PlaceRepository.findManyByTrip(tripId);
  }

  static async updatePlace(
    userId: string,
    placeId: string,
    data: UpdatePlaceInput & { dayId?: string | null }
  ) {
    const place = await this.requirePlace(placeId);
    await this.requireTripAccess(userId, place.tripId);
    return PlaceRepository.update(placeId, data);
  }

  static async deletePlace(userId: string, placeId: string) {
    const place = await this.requirePlace(placeId);
    await this.requireTripAccess(userId, place.tripId);
    await PlaceRepository.delete(placeId);
    await PlaceRepository.decrementVisitOrders(place.tripId, place.visitOrder ?? 1, place.dayId ?? undefined);
  }

  static async reorderPlaces(
    userId: string,
    tripId: string,
    orders: { id: string; visitOrder: number }[],
    dayId?: string
  ) {
    await this.requireTripAccess(userId, tripId);

    const existing = dayId
      ? await PlaceRepository.findManyByDay(dayId)
      : await PlaceRepository.findManyByTrip(tripId);
    const existingIds = new Set(existing.map((p) => p.id));

    for (const o of orders) {
      if (!existingIds.has(o.id)) {
        throw new NotFoundError(`Place ${o.id} not found`);
      }
    }

    return PlaceRepository.reorder(orders);
  }
}
