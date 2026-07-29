"use client";

import { useState } from "react";
import Image from "next/image";

import { usePlaceSearch } from "@/hooks/use-place-search";
import LoadingSpinner from "../ui/spinner";

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

      {isLoading && <LoadingSpinner />}

      {query && data && data.length === 0 ? (
        <div className="flex flex-col items-center py-8">
          <Image
            src="/assets/illustrations/empty-search.svg"
            alt="No results"
            className="size-32"
          />
          <p className="mt-3 text-sm text-muted-foreground">No places found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          {data?.map((place) => (
            <button
              key={place.id}
              className="block w-full border-b p-3 text-left hover:bg-muted"
              onClick={() => {
                onSelect({
                  name: place.name,
                  address: place.address,
                  latitude: place.latitude,
                  longitude: place.longitude,
                });
                setQuery("");
              }}
            >
              <div className="font-medium">{place.name}</div>
              {place.address && (
                <div className="text-sm text-muted-foreground">
                  {place.address}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
