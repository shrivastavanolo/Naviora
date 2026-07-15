import { useQuery } from "@tanstack/react-query";

import { searchPlaces } from "@/lib/mapbox";

export function usePlaceSearch(query: string) {
  return useQuery({
    queryKey: ["place-search", query],

    queryFn: () => searchPlaces(query),

    enabled: query.length > 2,

    staleTime: 1000 * 60 * 5,
  });
}
