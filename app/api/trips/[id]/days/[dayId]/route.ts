import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { TripDayService } from "@/src/services/trip-day.services";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ dayId: string }> }
) {
  try {
    const user = await requireAuth();
    const { dayId } = await params;
    const body = await request.json();
    const day = await TripDayService.updateDay(user.id, dayId, body);
    return NextResponse.json({ success: true, data: day });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ dayId: string }> }
) {
  try {
    const user = await requireAuth();
    const { dayId } = await params;
    await TripDayService.deleteDay(user.id, dayId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
