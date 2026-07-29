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
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        places: true,
      },
    });
  }

  static findManyByUser(userId: string, page = 1, limit = 9, q?: string) {
    return prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
        ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * limit,
      take: limit,
    });
  }

  static countByUser(userId: string, q?: string) {
    return prisma.trip.count({
      where: {
        members: {
          some: {
            userId,
          },
        },
        ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
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
