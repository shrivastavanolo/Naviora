"use client";

import { useState } from "react";

import { usePlaceSearch } from "@/hooks/use-place-search";

interface Props {
  onSelect(place: {
    name: string;
    latitude: number;
    longitude: number;
    address: string;
  }): void;
}

export function PlaceSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");

  const { data, isLoading } = usePlaceSearch(query);

  return (
    <div className="space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search places..."
        className="w-full rounded-md border p-2"
      />

      {isLoading && <p>Searching...</p>}

      <div className="rounded-md border">
        {data?.map((place) => (
          <button
            key={place.id}
            className="block w-full border-b p-3 text-left hover:bg-muted"
            onClick={() => {
              onSelect({
                name: place.place_name.split(",")[0],
                address: place.place_name,
                longitude: place.center[0],
                latitude: place.center[1],
              });
              setQuery("");
            }}
          >
            {place.place_name}
          </button>
        ))}
      </div>
    </div>
  );
}
