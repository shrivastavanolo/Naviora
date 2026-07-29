import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { InvitationService } from "@/src/services/invitation.services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const repository = await import("@/src/repositories/invitation.repository");
    const invitation = await repository.InvitationRepository.findByToken(token);
    if (!invitation) {
      return NextResponse.json(
        { success: false, message: "Invitation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: invitation });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const user = await requireAuth();
    const { token } = await params;
    const { action } = await request.json();

    if (action === "accept") {
      const result = await InvitationService.acceptInvitation(token, user.id);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "decline") {
      const result = await InvitationService.declineInvitation(token);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
