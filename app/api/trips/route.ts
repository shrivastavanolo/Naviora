import { requireAuth } from "@/src/lib/require-auth";
import { createTripSchema } from "@/src/schemas/trip";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";
import { success } from "zod";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const data = createTripSchema.parse(body);
    const trip = await TripService.createTrip(user.id, data);

    return NextResponse.json(
      {
        success: true,
        data: trip,
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

export async function GET() {
  try {
    const user = await requireAuth();
    const trips = await TripService.getMyTrips(user.id);

    return NextResponse.json(
      {
        success: true,
        data: trips,
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
