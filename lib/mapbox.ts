export interface PlaceSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

export async function searchPlaces(query: string) {
  const response = await fetch(
    `/api/mapbox/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search places");
  }

  return response.json() as Promise<PlaceSuggestion[]>;
}

export async function getRoute(coordinates: [number, number][]) {
  const token = process.env.MAPBOX_SECRET_TOKEN!;

  const coords = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(";");

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?geometries=geojson&overview=full&access_token=${token}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch route");
  }

  const data = await response.json();

  return data.routes[0].geometry;
}
