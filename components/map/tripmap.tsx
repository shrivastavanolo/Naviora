"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import type { Feature, LineString } from "geojson";

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

  const orderedPlaces = useMemo(
    () => [...places].sort((a, b) => a.visitOrder - b.visitOrder),
    [places]
  );

  const center = useMemo(
    () =>
      orderedPlaces[0]
        ? {
            longitude: orderedPlaces[0].longitude,
            latitude: orderedPlaces[0].latitude,
          }
        : { longitude: 0, latitude: 20 },
    [orderedPlaces]
  );

  const routeGeoJSON = useMemo<Feature<LineString> | null>(
    () =>
      orderedPlaces.length > 1
        ? {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: orderedPlaces.map(({ longitude, latitude }) => [
                longitude,
                latitude,
              ]),
            },
          }
        : null,
    [orderedPlaces]
  );

  useEffect(() => {
    if (!mapRef.current || !orderedPlaces.length) return;

    const bounds = new mapboxgl.LngLatBounds();

    orderedPlaces.forEach(({ longitude, latitude }) =>
      bounds.extend([longitude, latitude])
    );

    mapRef.current.fitBounds(bounds, {
      padding: 80,
      duration: 1000,
    });
  }, [orderedPlaces]);

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  if (!orderedPlaces.length) return null;

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ ...center, zoom: 12 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {routeGeoJSON && (
          <Source id="trip-route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="trip-route-line"
              type="line"
              paint={{
                "line-color": "#6D5EF5",
                "line-width": 4,
              }}
            />
          </Source>
        )}

        {orderedPlaces.map((place) => (
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
}
