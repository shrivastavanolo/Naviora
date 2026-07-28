import { requireAuth } from "@/src/lib/require-auth";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function POST(req: Request) {
  try {
    await requireAuth();
    const { coordinates } = await req.json();

    if (!coordinates || coordinates.length < 2) {
      return NextResponse.json(
        { error: "At least 2 coordinates required" },
        { status: 400 }
      );
    }

    const coords = coordinates
      .map(([lng, lat]: [number, number]) => `${lng},${lat}`)
      .join(";");

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${process.env.MAPBOX_SECRET_TOKEN}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Mapbox API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();

    if (!data.routes?.length) {
      throw new Error("Mapbox returned no routes");
    }

    return NextResponse.json({
      geometry: data.routes[0].geometry,
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
    });
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}
