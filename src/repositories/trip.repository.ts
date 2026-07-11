import { prisma } from "@/src/lib/prisma";

export class TripRepository {
  static create(data: {
    title: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    ownerId: string;
  }) {
    return prisma.trip.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        ownerId: data.ownerId,

        members: {
          create: {
            userId: data.ownerId,
            role: "OWNER",
          },
        },
      },

      include: {
        members: true,
      },
    });
  }

  static findById(id: string) {
    return prisma.trip.findUnique({
      where: {
        id,
      },

      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: true,
        places: true,
      },
    });
  }

  static findManyByUser(userId: string) {
    return prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static update(
    id: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return prisma.trip.update({
      where: {
        id,
      },

      data,
    });
  }

  static delete(id: string) {
    return prisma.trip.delete({
      where: {
        id,
      },
    });
  }
}
