import { afterEach, describe, expect, it, vi } from "vitest";

import { TripDayService } from "@/src/services/trip-day.services";
import { TripDayRepository } from "@/src/repositories/trip-day.repository";
import { TripRepository } from "@/src/repositories/trip.repository";
import { ForbiddenError, NotFoundError } from "@/src/lib/errors";

vi.mock("@/src/repositories/trip-day.repository", () => ({
  TripDayRepository: {
    findByTrip: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getNextDayNumber: vi.fn(),
  },
}));

vi.mock("@/src/repositories/trip.repository", () => ({
  TripRepository: {
    findById: vi.fn(),
  },
}));

vi.mock("@/src/services/activity-log.services", () => ({
  ActivityLogService: {
    log: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/src/services/notification.services", () => ({
  NotificationService: {
    create: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/lib/broadcast", () => ({
  broadcastTripUpdate: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const makeTrip = (overrides = {}) => ({
  id: "trip-1",
  ownerId: "user-1",
  members: [{ userId: "user-1", role: "OWNER" }],
  ...overrides,
});

const makeDay = (overrides = {}) => ({
  id: "day-1",
  dayNumber: 1,
  title: "Day 1",
  tripId: "trip-1",
  places: [],
  ...overrides,
});

describe("TripDayService", () => {
  describe("getDays", () => {
    it("should return days for a trip member", async () => {
      const trip = makeTrip();
      const days = [makeDay(), makeDay({ id: "day-2", dayNumber: 2 })];

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);
      vi.spyOn(TripDayRepository, "findByTrip").mockResolvedValue(days as never);

      const result = await TripDayService.getDays("user-1", "trip-1");

      expect(TripDayRepository.findByTrip).toHaveBeenCalledWith("trip-1");
      expect(result).toEqual(days);
    });

    it("should throw when trip does not exist", async () => {
      vi.spyOn(TripRepository, "findById").mockResolvedValue(null);

      await expect(TripDayService.getDays("user-1", "trip-1")).rejects.toThrow(NotFoundError);
    });

    it("should throw when user is not a member", async () => {
      const trip = makeTrip({ members: [] });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);

      await expect(TripDayService.getDays("user-1", "trip-1")).rejects.toThrow(ForbiddenError);
    });
  });

  describe("createDay", () => {
    it("should create a day with the next day number", async () => {
      const trip = makeTrip();
      const day = makeDay({ dayNumber: 2, title: "Day 2" });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);
      vi.spyOn(TripDayRepository, "getNextDayNumber").mockResolvedValue(2);
      vi.spyOn(TripDayRepository, "create").mockResolvedValue(day as never);

      const result = await TripDayService.createDay("user-1", "trip-1");

      expect(TripDayRepository.getNextDayNumber).toHaveBeenCalledWith("trip-1");
      expect(TripDayRepository.create).toHaveBeenCalledWith({
        dayNumber: 2,
        title: "Day 2",
        tripId: "trip-1",
      });
      expect(result).toEqual(day);
    });

    it("should create a day with a custom title", async () => {
      const trip = makeTrip();
      const day = makeDay({ dayNumber: 2, title: "Custom" });

      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);
      vi.spyOn(TripDayRepository, "getNextDayNumber").mockResolvedValue(2);
      vi.spyOn(TripDayRepository, "create").mockResolvedValue(day as never);

      await TripDayService.createDay("user-1", "trip-1", "Custom");

      expect(TripDayRepository.create).toHaveBeenCalledWith({
        dayNumber: 2,
        title: "Custom",
        tripId: "trip-1",
      });
    });
  });

  describe("updateDay", () => {
    it("should update a day", async () => {
      const day = makeDay();
      const trip = makeTrip();
      const updated = { ...day, title: "Updated" };

      vi.spyOn(TripDayRepository, "findById").mockResolvedValue(day as never);
      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);
      vi.spyOn(TripDayRepository, "update").mockResolvedValue(updated as never);

      const result = await TripDayService.updateDay("user-1", "day-1", { title: "Updated" });

      expect(TripDayRepository.update).toHaveBeenCalledWith("day-1", { title: "Updated" });
      expect(result).toEqual(updated);
    });

    it("should throw when day does not exist", async () => {
      vi.spyOn(TripDayRepository, "findById").mockResolvedValue(null);

      await expect(TripDayService.updateDay("user-1", "day-1", { title: "Updated" })).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteDay", () => {
    it("should delete a day", async () => {
      const day = makeDay();
      const trip = makeTrip();

      vi.spyOn(TripDayRepository, "findById").mockResolvedValue(day as never);
      vi.spyOn(TripRepository, "findById").mockResolvedValue(trip as never);
      vi.spyOn(TripDayRepository, "delete").mockResolvedValue(undefined as never);

      await TripDayService.deleteDay("user-1", "day-1");

      expect(TripDayRepository.delete).toHaveBeenCalledWith("day-1");
    });

    it("should throw when day does not exist", async () => {
      vi.spyOn(TripDayRepository, "findById").mockResolvedValue(null);

      await expect(TripDayService.deleteDay("user-1", "day-1")).rejects.toThrow(NotFoundError);
    });
  });
});
