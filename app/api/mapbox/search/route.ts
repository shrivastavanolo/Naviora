import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const token = process.env.MAPBOX_SECRET_TOKEN!;

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
    `${encodeURIComponent(query)}.json` +
    `?limit=5&access_token=${token}`;

  const response = await fetch(url);

  const data = await response.json();

  return NextResponse.json(data.features);
}
