import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { InvitationService } from "@/src/services/invitation.services";
import { InvitationRepository } from "@/src/repositories/invitation.repository";
import { TripRepository } from "@/src/repositories/trip.repository";

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;
    const body = await request.json();
    const { email } = inviteSchema.parse(body);

    const invitation = await InvitationService.inviteByEmail(user.id, tripId, email);

    return NextResponse.json({ success: true, data: invitation }, { status: 201 });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;

    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      return NextResponse.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      );
    }

    const isMember = trip.members.some((m) => m.userId === user.id);
    if (!isMember) {
      return NextResponse.json(
        { success: false, message: "Not a member" },
        { status: 403 }
      );
    }

    const invitations = await InvitationRepository.findPendingByTrip(tripId);

    return NextResponse.json({ success: true, data: invitations });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
