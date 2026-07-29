import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { InvitationService } from "@/src/services/invitation.services";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId, invitationId } = await params;

    await InvitationService.cancelInvitation(user.id, tripId, invitationId);

    return NextResponse.json({ success: true, data: { id: invitationId } });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
