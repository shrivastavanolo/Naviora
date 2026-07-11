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

  static getNextVisitOrder(tripId: string) {
    return prisma.place.count({
      where: {
        tripId,
      },
    });
  }
}
