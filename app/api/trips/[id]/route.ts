import { requireAuth } from "@/src/lib/require-auth";
import { createTripSchema } from "@/src/schemas/trip";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const data = createTripSchema.parse(body);
    const trip = await TripService.updateTrip(user.id, id, data);

    const response = NextResponse.json(
      {
        success: true,
        data: trip,
      },
      {
        status: 200,
      }
    );
    return response;
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    console.log("tripId", id);

    const trip = await TripService.getTrip(user.id, id);

    const response = NextResponse.json(
      {
        data: trip,
      },
      {
        status: 200,
      }
    );
    return response;
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const trip = await TripService.deleteTrip(user.id, id);

    const response = NextResponse.json(
      {
        success: true,
        data: trip,
      },
      {
        status: 200,
      }
    );
    return response;
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}
