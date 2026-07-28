"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: Marker[];
}

export function Map({
  latitude = 20.5937,
  longitude = 78.9629,
  zoom = 4,
  markers = [],
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    markers.forEach((marker) => {
      const m = new mapboxgl.Marker()
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapRef.current!);

      markerRefs.current.push(m);
    });
  }, [markers]);

  return <div ref={containerRef} className="h-125 w-full rounded-xl border" />;
}
