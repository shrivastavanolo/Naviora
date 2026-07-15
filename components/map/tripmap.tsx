"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";

import { usePlaces } from "@/hooks/use-places";
import type { Place } from "@/types/place";

interface Props {
  tripId: string;
}

export default function TripMap({ tripId }: Props) {
  const mapRef = useRef<MapRef>(null);
  const { data: places = [], isLoading } = usePlaces(tripId);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!mapRef.current || places.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    places.forEach((place) => {
      bounds.extend([place.longitude, place.latitude]);
    });

    mapRef.current.fitBounds(bounds, {
      padding: 80,
      duration: 1000,
    });
  }, [places]);

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  const center = places.length
    ? {
        longitude: places[0].longitude,
        latitude: places[0].latitude,
      }
    : {
        longitude: 0,
        latitude: 20,
      };

  const map = (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          ...center,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            longitude={place.longitude}
            latitude={place.latitude}
            anchor="bottom"
          >
            <button
              onClick={() => setSelectedPlace(place)}
              className="text-3xl"
            >
              📍
            </button>
          </Marker>
        ))}

        {selectedPlace && (
          <Popup
            longitude={selectedPlace.longitude}
            latitude={selectedPlace.latitude}
            anchor="top"
            onClose={() => setSelectedPlace(null)}
          >
            <div>
              <h3 className="font-semibold">{selectedPlace.name}</h3>

              <p>{selectedPlace.address}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
  return <>{places.length > 0 ? map : null}</>;
}
