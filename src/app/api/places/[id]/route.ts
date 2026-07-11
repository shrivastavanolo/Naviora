import { requireAuth } from "@/src/lib/require-auth";
import { updatePlaceSchema } from "@/src/schemas/place";
import { PlaceService } from "@/src/services/place.services";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: placeId } = await params;

    const place = await PlaceService.getPlace(user.id, placeId);

    return NextResponse.json(
      {
        success: true,
        data: place,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: placeId } = await params;
    const body = await request.json();

    const data = updatePlaceSchema.parse(body);
    const place = await PlaceService.updatePlace(user.id, placeId, data);

    return NextResponse.json(
      {
        success: true,
        data: place,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: placeId } = await params;

    await PlaceService.deletePlace(user.id, placeId);

    return NextResponse.json(
      {
        success: true,
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
