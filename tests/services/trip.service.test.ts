import { afterEach, describe, expect, it, vi } from "vitest";

import { TripService } from "@/src/services/trip.services";
import { TripRepository } from "@/src/repositories/trip.repository";
import { ForbiddenError, NotFoundError } from "@/src/lib/errors";

vi.mock("@/src/repositories/trip.repository", () => ({
  TripRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    findManyByUser: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

const makeTrip = (overrides = {}) => ({
  id: "trip-1",
  title: "Japan",
  description: null,
  ownerId: "user-1",
  startDate: null,
  endDate: null,
  members: [
    {
      userId: "user-1",
      role: "OWNER",
    },
  ],
  ...overrides,
});

describe("TripService", () => {
  describe("createTrip", () => {
    it("should create a trip for the authenticated user", async () => {
      const input = {
        title: "Japan",
        description: "Vacation",
      };

      const createdTrip = makeTrip(input);

      vi.spyOn(TripRepository, "create").mockResolvedValue(
        createdTrip as never
      );

      const result = await TripService.createTrip("user-1", input);

      expect(TripRepository.create).toHaveBeenCalledOnce();

      expect(TripRepository.create).toHaveBeenCalledWith({
        ...input,
        ownerId: "user-1",
      });

      expect(result).toEqual(createdTrip);
    });
  });

  describe("getTrip", () => {
    it("should throw when trip does not exist", async () => {
      vi.spyOn(TripRepository, "findById").mockResolvedValue(null);

      await expect(TripService.getTrip("user-1", "trip-1")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should return trip for a member", async () => {
      const trip = makeTrip();

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      const result = await TripService.getTrip("user-1", "trip-1");

      expect(TripRepository.findById).toHaveBeenCalledWith("trip-1");
      expect(result).toEqual(trip);
    });

    it("should throw when user is not a member", async () => {
      const trip = makeTrip({
        members: [
          {
            userId: "another-user",
            role: "OWNER",
          },
        ],
      });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(TripService.getTrip("user-1", "trip-1")).rejects.toThrow(
        ForbiddenError
      );
    });
  });

  describe("getMyTrips", () => {
    it("should return all trips for the user", async () => {
      const trips = [makeTrip(), makeTrip({ id: "trip-2" })];

      vi.spyOn(TripRepository, "findManyByUser").mockResolvedValue(
        trips as never
      );

      const result = await TripService.getMyTrips("user-1");

      expect(TripRepository.findManyByUser).toHaveBeenCalledWith("user-1");
      expect(result).toEqual(trips);
    });
  });

  describe("updateTrip", () => {
    it("should throw when trip does not exist", async () => {
      vi.spyOn(TripRepository, "findById").mockResolvedValue(null);

      await expect(
        TripService.updateTrip("user-1", "trip-1", {
          title: "Updated",
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw when user is not the owner", async () => {
      const trip = makeTrip({
        ownerId: "another-user",
      });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(
        TripService.updateTrip("user-1", "trip-1", {
          title: "Updated",
        })
      ).rejects.toThrow(ForbiddenError);
    });

    it("should update the trip", async () => {
      const trip = makeTrip();

      const updatedTrip = {
        ...trip,
        title: "Updated",
      };

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      vi.spyOn(TripRepository, "update").mockResolvedValue(
        updatedTrip as never
      );

      const result = await TripService.updateTrip("user-1", "trip-1", {
        title: "Updated",
      });

      expect(TripRepository.update).toHaveBeenCalledWith("trip-1", {
        title: "Updated",
      });

      expect(result).toEqual(updatedTrip);
    });
  });

  describe("deleteTrip", () => {
    it("should throw when trip does not exist", async () => {
      vi.spyOn(TripRepository, "findById").mockResolvedValue(null);

      await expect(TripService.deleteTrip("user-1", "trip-1")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw when user is not the owner", async () => {
      const trip = makeTrip({
        ownerId: "another-user",
      });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(TripService.deleteTrip("user-1", "trip-1")).rejects.toThrow(
        ForbiddenError
      );
    });

    it("should delete the trip", async () => {
      const trip = makeTrip();

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      vi.spyOn(TripRepository, "delete").mockResolvedValue(undefined as never);

      await TripService.deleteTrip("user-1", "trip-1");

      expect(TripRepository.delete).toHaveBeenCalledOnce();

      expect(TripRepository.delete).toHaveBeenCalledWith("trip-1");
    });
  });
});
