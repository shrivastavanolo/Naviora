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
    data: CreatePlaceInput
  ) {
    const trip = await this.requireTripAccess(userId, tripId);
    const nextVisitOrder = await PlaceRepository.getNextVisitOrder(tripId);

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
    data: UpdatePlaceInput
  ) {
    const place = await this.requirePlace(placeId);
    await this.requireTripAccess(userId, place.tripId);
    return PlaceRepository.update(placeId, data);
  }

  static async deletePlace(userId: string, placeId: string) {
    const place = await this.requirePlace(placeId);
    await this.requireTripAccess(userId, place.tripId);
    await PlaceRepository.delete(placeId);
  }
}
