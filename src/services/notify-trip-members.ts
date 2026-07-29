import { NotificationService } from "@/src/services/notification.services";
import { prisma } from "@/src/lib/prisma";

export async function notifyTripMembers(
  tripId: string,
  actorId: string,
  type: string,
  title: string,
  body?: string | null,
  data?: Record<string, unknown> | null
) {
  const members = await prisma.tripMember.findMany({
    where: { tripId, userId: { not: actorId } },
    select: { userId: true },
  });

  for (const member of members) {
    await NotificationService.create({
      userId: member.userId,
      actorId,
      type,
      tripId,
      title,
      body: body ?? null,
      data: data ?? null,
    });
  }
}
