import { prisma } from "@/src/lib/prisma";

export class TripDayRepository {
  static findByTrip(tripId: string) {
    return prisma.tripDay.findMany({
      where: { tripId },
      include: {
        places: {
          orderBy: { visitOrder: "asc" },
        },
      },
      orderBy: { dayNumber: "asc" },
    });
  }

  static findById(id: string) {
    return prisma.tripDay.findUnique({
      where: { id },
      include: {
        places: {
          orderBy: { visitOrder: "asc" },
        },
      },
    });
  }

  static create(data: {
    dayNumber: number;
    title?: string;
    tripId: string;
  }) {
    return prisma.tripDay.create({
      data: {
        dayNumber: data.dayNumber,
        title: data.title,
        tripId: data.tripId,
      },
    });
  }

  static update(
    id: string,
    data: {
      dayNumber?: number;
      title?: string | null;
    }
  ) {
    return prisma.tripDay.update({
      where: { id },
      data,
    });
  }

  static delete(id: string) {
    return prisma.tripDay.delete({
      where: { id },
    });
  }

  static async getNextDayNumber(tripId: string) {
    const max = await prisma.tripDay.findFirst({
      where: { tripId },
      orderBy: { dayNumber: "desc" },
      select: { dayNumber: true },
    });
    return (max?.dayNumber ?? 0) + 1;
  }
}
