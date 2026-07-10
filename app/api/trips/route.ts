import { requireAuth } from "@/src/lib/require-auth";
import { createTripSchema } from "@/src/schemas/trip";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const data = createTripSchema.parse(body);
    const trip = await TripService.createTrip(user.id, data);

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

export async function GET() {
  try {
    const user = await requireAuth();
    const trip = await TripService.getMyTrips(user.id);

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
