import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "@/src/lib/errors";
import { TripRepository } from "@/src/repositories/trip.repository";
import { InvitationRepository } from "@/src/repositories/invitation.repository";
import { ActivityLogService } from "@/src/services/activity-log.services";
import { NotificationService } from "@/src/services/notification.services";
import { prisma } from "@/src/lib/prisma";

const INVITATION_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export class InvitationService {
  private static async requireOwnerAccess(userId: string, tripId: string) {
    const trip = await TripRepository.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found");
    if (trip.ownerId !== userId) {
      throw new ForbiddenError("Only the trip owner can send invitations");
    }
    return trip;
  }

  static async inviteByEmail(userId: string, tripId: string, email: string) {
    const trip = await this.requireOwnerAccess(userId, tripId);

    const existingMember = trip.members.find((m) => {
      return m.userId === email;
    });
    if (existingMember) {
      throw new ConflictError("User is already a member of this trip");
    }

    const pending = await InvitationRepository.findPendingByTrip(tripId);
    if (pending.some((i) => i.inviteeEmail === email)) {
      throw new ConflictError("Invitation already sent to this email");
    }

    const { default: crypto } = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");

    const invitation = await InvitationRepository.create({
      tripId,
      inviterId: userId,
      inviteeEmail: email,
      token,
    });

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY!);

      await resend.emails.send({
        from: "Naviora <onboarding@resend.dev>",
        to: email,
        subject: `You're invited to join "${trip.title}" on Naviora`,
        html: `
          <p><strong>${invitation.inviter.name}</strong> has invited you to collaborate on their trip "<strong>${trip.title}</strong>".</p>
          <p>Click the link below to accept:</p>
          <a href="${INVITATION_ORIGIN}/invitations/${token}">${INVITATION_ORIGIN}/invitations/${token}</a>
          <p>If you don't have an account yet, you'll be prompted to sign up first.</p>
        `,
      });
    } catch (err) {
      console.error("Failed to send invitation email:", err);
    }

    return invitation;
  }

  static async acceptInvitation(token: string, userId: string) {
    const invitation = await InvitationRepository.findByToken(token);
    if (!invitation) throw new NotFoundError("Invitation not found");
    if (invitation.status !== "PENDING") {
      throw new BadRequestError("Invitation is no longer pending");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    const existingMember = await prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId: invitation.tripId, userId } },
    });
    if (existingMember) {
      throw new ConflictError("You are already a member of this trip");
    }

    const member = await prisma.tripMember.create({
      data: {
        tripId: invitation.tripId,
        userId,
        role: "MEMBER",
      },
    });

    await InvitationRepository.updateStatus(invitation.id, "ACCEPTED");

    await ActivityLogService.log(invitation.tripId, userId, "member_joined", {
      userName: user.name,
      email: user.email,
    });

    await NotificationService.create({
      userId: invitation.inviterId,
      actorId: userId,
      type: "member_joined",
      tripId: invitation.tripId,
      title: `${user.name} joined "${invitation.trip?.title ?? "the trip"}"`,
      body: null,
      data: null,
    });

    return { ...invitation, member };
  }

  static async declineInvitation(token: string) {
    const invitation = await InvitationRepository.findByToken(token);
    if (!invitation) throw new NotFoundError("Invitation not found");
    if (invitation.status !== "PENDING") {
      throw new BadRequestError("Invitation is no longer pending");
    }

    return InvitationRepository.updateStatus(invitation.id, "DECLINED");
  }

  static async getPendingInvitations(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");
    return InvitationRepository.findPendingByEmail(user.email);
  }
}
