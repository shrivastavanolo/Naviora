import { prisma } from "@/src/lib/prisma";

export class InvitationRepository {
  static create(data: {
    tripId: string;
    inviterId: string;
    inviteeEmail: string;
    token: string;
  }) {
    return prisma.invitation.create({
      data: {
        tripId: data.tripId,
        inviterId: data.inviterId,
        inviteeEmail: data.inviteeEmail,
        token: data.token,
      },
      include: {
        inviter: { select: { id: true, name: true } },
        trip: { select: { id: true, title: true } },
      },
    });
  }

  static findByToken(token: string) {
    return prisma.invitation.findUnique({
      where: { token },
      include: {
        inviter: { select: { id: true, name: true } },
        trip: { select: { id: true, title: true } },
      },
    });
  }

  static findPendingByTrip(tripId: string) {
    return prisma.invitation.findMany({
      where: { tripId, status: "PENDING" },
      include: {
        inviter: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static findPendingByEmail(email: string) {
    return prisma.invitation.findMany({
      where: { inviteeEmail: email, status: "PENDING" },
      include: {
        inviter: { select: { id: true, name: true } },
        trip: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static updateStatus(id: string, status: "ACCEPTED" | "DECLINED" | "EXPIRED") {
    return prisma.invitation.update({
      where: { id },
      data: { status },
    });
  }
}
