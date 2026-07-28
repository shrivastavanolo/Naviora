import { NextResponse } from "next/server";

import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";

import { PlaceRepository } from "@/src/repositories/place.repository";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestNeighbor<T extends { id: string; latitude: number; longitude: number }>(
  places: T[]
) {
  const remaining = new Set(places.map((p) => p.id));
  const ordered: T[] = [];

  if (places.length === 0) return ordered;

  let current = places[0];
  ordered.push(current);
  remaining.delete(current.id);

  while (remaining.size > 0) {
    let nearest = current;
    let nearestDist = Infinity;

    for (const p of places) {
      if (!remaining.has(p.id)) continue;
      const dist = haversine(
        current.latitude,
        current.longitude,
        p.latitude,
        p.longitude
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = p;
      }
    }

    ordered.push(nearest);
    remaining.delete(nearest.id);
    current = nearest;
  }

  return ordered;
}

const MAPBOX_MAX_WAYPOINTS = 12;

export async function POST(request: Request) {
  try {
    await requireAuth();

    const { tripId } = await request.json();

    if (!tripId) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const places = await PlaceRepository.findManyByTrip(tripId);

    if (places.length < 2) {
      return NextResponse.json({
        success: true,
        data: places,
      });
    }

    let optimized: typeof places;

    if (places.length <= MAPBOX_MAX_WAYPOINTS) {
      const coordinates = places
        .map((place) => `${place.longitude},${place.latitude}`)
        .join(";");

      const url =
        `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}` +
        `?geometries=geojson` +
        `&overview=full` +
        `&steps=false` +
        `&source=first` +
        `&destination=last` +
        `&roundtrip=false` +
        `&access_token=${process.env.MAPBOX_SECRET_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Mapbox API error (${response.status}): ${errorBody}`);
      }

      const data = await response.json();

      const waypoints: { waypoint_index: number }[] = data.waypoints || [];

      optimized = waypoints.map(
        (waypoint) => places[waypoint.waypoint_index]
      );
    } else {
      optimized = nearestNeighbor(places);
    }

    await Promise.all(
      optimized.map((place, index) =>
        PlaceRepository.update(place.id, { visitOrder: index + 1 })
      )
    );

    return NextResponse.json({
      success: true,
      data: optimized,
    });
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, {
      status,
    });
  }
}
