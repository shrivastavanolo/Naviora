import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { TripDayService } from "@/src/services/trip-day.services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;
    const days = await TripDayService.getDays(user.id, tripId);
    return NextResponse.json({ success: true, data: days });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;
    const body = await request.json();
    const day = await TripDayService.createDay(user.id, tripId, body.title);
    return NextResponse.json({ success: true, data: day }, { status: 201 });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
