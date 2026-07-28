"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import type { Feature, LineString, FeatureCollection, Point } from "geojson";
import { useRoute } from "@/hooks/use-route";

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

  const mapKey = useMemo(
    () => orderedPlaces.map((p) => `${p.id}-${p.visitOrder}`).join("|"),
    [orderedPlaces]
  );

  const coordinates = useMemo(
    () =>
      orderedPlaces.map((place) => [place.longitude, place.latitude]),
    [orderedPlaces]
  );

  const { data: route } = useRoute(coordinates);

  const routeGeoJSON: Feature<LineString> | null = route
    ? {
        type: "Feature",
        properties: {},
        geometry: route.geometry,
      }
    : null;

  const waypointsGeoJSON: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: orderedPlaces.map((place) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
    })),
  };

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
        key={mapKey}
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ ...center, zoom: 12 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {routeGeoJSON && (
          <Source id="trip-route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="trip-route-glow"
              type="line"
              paint={{
                "line-color": "#6D5EF5",
                "line-width": 10,
                "line-opacity": 0.2,
                "line-blur": 3,
              }}
            />
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

        {orderedPlaces.length > 0 && (
          <Source id="waypoints" type="geojson" data={waypointsGeoJSON}>
            <Layer
              id="waypoints-dots"
              type="circle"
              paint={{
                "circle-radius": 5,
                "circle-color": "#6D5EF5",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              }}
            />
          </Source>
        )}

        {orderedPlaces.map((place, index) => {
          const isFirst = index === 0;
          const isLast = index === orderedPlaces.length - 1;
          const bgColor = isFirst
            ? "bg-green-600"
            : isLast
              ? "bg-red-600"
              : "bg-purple-600";

          return (
            <Marker
              key={place.id}
              longitude={place.longitude}
              latitude={place.latitude}
              anchor="bottom"
            >
              <button
                onClick={() => setSelectedPlace(place)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor} text-white text-sm font-bold shadow-md border-2 border-white`}
                >
                  {place.visitOrder}
                </div>
                <span className="mt-0.5 px-1.5 py-0.5 bg-white/90 rounded text-xs font-medium shadow-sm text-nowrap">
                  {place.name}
                </span>
              </button>
            </Marker>
          );
        })}

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
