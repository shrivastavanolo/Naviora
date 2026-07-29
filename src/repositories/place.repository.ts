import { prisma } from "@/src/lib/prisma";

export class PlaceRepository {
  static create(data: {
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    notes?: string;
    visitOrder?: number;
    estimatedDuration?: number;
    tripId: string;
    dayId?: string;
  }) {
    return prisma.place.create({
      data: {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        notes: data.notes,
        visitOrder: data.visitOrder,
        estimatedDuration: data.estimatedDuration,
        tripId: data.tripId,
        dayId: data.dayId,
      },
    });
  }

  static findById(id: string) {
    return prisma.place.findUnique({
      where: {
        id,
      },
    });
  }

  static findManyByTrip(tripId: string) {
    return prisma.place.findMany({
      where: {
        tripId,
      },

      orderBy: {
        visitOrder: "asc",
      },
    });
  }

  static findManyByDay(dayId: string) {
    return prisma.place.findMany({
      where: { dayId },
      orderBy: { visitOrder: "asc" },
    });
  }

  static update(
    id: string,
    data: {
      name?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      notes?: string;
      visitOrder?: number;
      estimatedDuration?: number;
      tripId?: string;
      dayId?: string | null;
    }
  ) {
    return prisma.place.update({
      where: {
        id,
      },

      data,
    });
  }

  static delete(id: string) {
    return prisma.place.delete({
      where: {
        id,
      },
    });
  }

  static decrementVisitOrders(tripId: string, fromOrder: number, dayId?: string) {
    return prisma.place.updateMany({
      where: {
        tripId,
        ...(dayId ? { dayId } : {}),
        visitOrder: { gt: fromOrder },
      },
      data: {
        visitOrder: { decrement: 1 },
      },
    });
  }

  static reorder(orders: { id: string; visitOrder: number }[]) {
    return prisma.$transaction(
      orders.map(({ id, visitOrder }) =>
        prisma.place.update({
          where: { id },
          data: { visitOrder },
        })
      )
    );
  }

  static async getNextVisitOrder(tripId: string, dayId?: string) {
    return prisma.place.count({
      where: {
        tripId,
        ...(dayId ? { dayId } : {}),
      },
    });
  }
}
