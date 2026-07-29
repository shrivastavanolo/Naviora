export async function searchPlaces(query: string) {
  const response = await fetch(
    `/api/places/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search places");
  }

  return response.json();
}
