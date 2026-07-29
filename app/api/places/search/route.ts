import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 5,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google Places API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  const results = (data.places ?? []).map(
    (place: {
      id: string;
      displayName?: { text: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
    }) => ({
      id: place.id,
      name: place.displayName?.text ?? "Unknown",
      address: place.formattedAddress ?? "",
      latitude: place.location?.latitude ?? 0,
      longitude: place.location?.longitude ?? 0,
    })
  );

  return NextResponse.json(results);
}
