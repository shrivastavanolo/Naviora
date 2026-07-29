export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export async function searchPlaces(query: string) {
  const response = await fetch(
    `/api/places/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search places");
  }

  return response.json() as Promise<PlaceSuggestion[]>;
}
