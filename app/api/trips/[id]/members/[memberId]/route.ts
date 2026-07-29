import { requireAuth } from "@/src/lib/require-auth";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, memberId } = await params;

    await TripService.removeMember(user.id, id, memberId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
