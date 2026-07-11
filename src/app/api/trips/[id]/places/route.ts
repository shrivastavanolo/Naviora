import { requireAuth } from "@/src/lib/require-auth";
import { createPlaceSchema } from "@/src/schemas/place";
import { PlaceService } from "@/src/services/place.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;
    const body = await request.json();

    const data = createPlaceSchema.parse(body);
    const place = await PlaceService.createPlace(user.id, tripId, data);

    return NextResponse.json(
      {
        success: true,
        data: place,
      },
      {
        status: 201,
      }
    );
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

    const places = await PlaceService.getTripPlaces(user.id, tripId);

    return NextResponse.json(
      {
        success: true,
        data: places,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}
