"use client";
import React, { useEffect, useRef } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// Paris city center coordinates
const PARIS_CENTER = { lat: 48.8566, lng: 2.3522 };

// Helper to generate random coordinates within a bounding box around Paris
const generateRandomParisPlaces = (count: number) => {
  // Paris bounding box (approximate)
  const minLat = 48.82;
  const maxLat = 48.9;
  const minLng = 2.25;
  const maxLng = 2.42;

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    lat: +(Math.random() * (maxLat - minLat) + minLat).toFixed(6),
    lng: +(Math.random() * (maxLng - minLng) + minLng).toFixed(6),
  }));
};

const randomPlaces = generateRandomParisPlaces(50);

function MarkerClustererComponent({
  places,
}: {
  places: { id: number; lat: number; lng: number }[];
}) {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clean up old markers and clusterer
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }

    // Create new markers
    const markers = places.map(
      (place) =>
        new google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: map,
        })
    );
    markersRef.current = markers;

    // Create clusterer
    clustererRef.current = new MarkerClusterer({
      map: map,
      markers,
      // You can customize cluster icons and options here
    });

    // Cleanup on unmount
    return () => {
      markers.forEach((marker) => marker.setMap(null));
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
    };
  }, [map, places]);

  return null;
}

const GoogleMap = () => {
  return (
    <div className="w-full h-full">
      <Map
        defaultZoom={13}
        defaultCenter={PARIS_CENTER}
        gestureHandling="cooperative"
        disableDefaultUI={false}
      >
        <MarkerClustererComponent places={randomPlaces} />
      </Map>
    </div>
  );
};

export default GoogleMap;
