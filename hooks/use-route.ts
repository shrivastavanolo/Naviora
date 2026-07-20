import { useQuery } from "@tanstack/react-query";

interface RouteResponse {
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  distance: number;
  duration: number;
}

export function useRoute(coordinates: number[][]) {
  return useQuery<RouteResponse>({
    queryKey: ["route", coordinates],
    queryFn: async () => {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch route");
      }

      return res.json();
    },
    enabled: coordinates.length > 1,
  });
}
