import { prisma } from "@/src/lib/prisma";

export class TripMemberRepository {
  static findByUserId(userId: string) {
    return prisma.tripMember.findMany({
      where: { userId },
    });
  }

  static findByTripAndUser(tripId: string, userId: string) {
    return prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });
  }

  static remove(tripId: string, userId: string) {
    return prisma.tripMember.delete({
      where: { tripId_userId: { tripId, userId } },
    });
  }
}
