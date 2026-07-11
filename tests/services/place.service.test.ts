import { afterEach, describe, expect, it, vi } from "vitest";

import { PlaceService } from "@/src/services/place.services";
import { PlaceRepository } from "@/src/repositories/place.repository";
import { TripRepository } from "@/src/repositories/trip.repository";
import { ForbiddenError, NotFoundError } from "@/src/lib/errors";

vi.mock("@/src/repositories/place.repository", () => ({
  PlaceRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    findManyByTrip: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getNextVisitOrder: vi.fn(),
  },
}));

vi.mock("@/src/repositories/trip.repository", () => ({
  TripRepository: {
    findById: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

const makeTrip = (overrides = {}) => ({
  id: "trip-1",
  ownerId: "user-1",
  members: [
    {
      userId: "user-1",
      role: "OWNER",
    },
  ],
  ...overrides,
});

const makePlace = (overrides = {}) => ({
  id: "place-1",
  name: "Tokyo Tower",
  latitude: 35.6586,
  longitude: 139.7454,
  tripId: "trip-1",
  visitOrder: 1,
  notes: null,
  address: null,
  estimatedDuration: null,
  ...overrides,
});

describe("PlaceService", () => {
  describe("createPlace", () => {
    it("should create a place with the next visit order", async () => {
      const trip = makeTrip();

      const input = {
        name: "Shibuya",
        latitude: 35.66,
        longitude: 139.7,
        address: "Tokyo",
        notes: "Busy crossing",
        estimatedDuration: 90,
      };

      const createdPlace = makePlace({
        ...input,
        visitOrder: 4,
      });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      vi.spyOn(PlaceRepository, "getNextVisitOrder").mockResolvedValue(3);

      vi.spyOn(PlaceRepository, "create").mockResolvedValue(
        createdPlace as never
      );

      const result = await PlaceService.createPlace("user-1", "trip-1", input);

      expect(PlaceRepository.getNextVisitOrder).toHaveBeenCalledWith("trip-1");

      expect(PlaceRepository.create).toHaveBeenCalledWith({
        ...input,
        visitOrder: 4,
        tripId: "trip-1",
      });

      expect(result).toEqual(createdPlace);
    });

    it("should throw when trip does not exist", async () => {
      vi.spyOn(TripRepository, "findById").mockResolvedValue(null);

      await expect(
        PlaceService.createPlace("user-1", "trip-1", {
          name: "Tokyo",
          latitude: 1,
          longitude: 1,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw when user is not a member", async () => {
      const trip = makeTrip({
        members: [],
      });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(
        PlaceService.createPlace("user-1", "trip-1", {
          name: "Tokyo",
          latitude: 1,
          longitude: 1,
        })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("getPlace", () => {
    it("should return the place", async () => {
      const place = makePlace();
      const trip = makeTrip();

      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(place as never);
      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      const result = await PlaceService.getPlace("user-1", "place-1");

      expect(result).toEqual(place);
    });

    it("should throw when place does not exist", async () => {
      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(null);

      await expect(PlaceService.getPlace("user-1", "place-1")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw when user is not a trip member", async () => {
      const place = makePlace();

      const trip = makeTrip({
        members: [],
      });

      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(place as never);
      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(PlaceService.getPlace("user-1", "place-1")).rejects.toThrow(
        ForbiddenError
      );
    });
  });

  describe("getTripPlaces", () => {
    it("should return all places", async () => {
      const trip = makeTrip();

      const places = [
        makePlace(),
        makePlace({
          id: "place-2",
          name: "Shibuya",
        }),
      ];

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      vi.spyOn(PlaceRepository, "findManyByTrip").mockResolvedValue(
        places as never
      );

      const result = await PlaceService.getTripPlaces("user-1", "trip-1");

      expect(PlaceRepository.findManyByTrip).toHaveBeenCalledWith("trip-1");

      expect(result).toEqual(places);
    });

    it("should reject non-members", async () => {
      const trip = makeTrip({
        members: [],
      });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(
        PlaceService.getTripPlaces("user-1", "trip-1")
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("updatePlace", () => {
    it("should update the place", async () => {
      const place = makePlace();
      const trip = makeTrip();

      const updatedPlace = {
        ...place,
        name: "Updated",
      };

      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(place as never);

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      vi.spyOn(PlaceRepository, "update").mockResolvedValue(
        updatedPlace as never
      );

      const result = await PlaceService.updatePlace("user-1", "place-1", {
        name: "Updated",
      });

      expect(PlaceRepository.update).toHaveBeenCalledWith("place-1", {
        name: "Updated",
      });

      expect(result).toEqual(updatedPlace);
    });

    it("should throw when place does not exist", async () => {
      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(null);

      await expect(
        PlaceService.updatePlace("user-1", "place-1", {
          name: "Updated",
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deletePlace", () => {
    it("should delete the place", async () => {
      const place = makePlace();
      const trip = makeTrip();

      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(place as never);

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      vi.spyOn(PlaceRepository, "delete").mockResolvedValue(undefined as never);

      await PlaceService.deletePlace("user-1", "place-1");

      expect(PlaceRepository.delete).toHaveBeenCalledWith("place-1");
    });

    it("should throw when place does not exist", async () => {
      vi.spyOn(PlaceRepository, "findById").mockResolvedValue(null);

      await expect(
        PlaceService.deletePlace("user-1", "place-1")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
