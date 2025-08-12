"use client";

import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

interface MetroStation {
  name: string;
  time: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface OfficeLocationProps {
  address: string;
  metroStations: MetroStation[];
  coordinates: Coordinates;
}

function OfficeMarker({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create marker for the office location
    markerRef.current = new google.maps.Marker({
      position: { lat: coordinates.lat, lng: coordinates.lng },
      map: map,
      title: "Office Location",
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#3B82F6"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16),
      },
    });

    // Center map on the office location
    map.setCenter({ lat: coordinates.lat, lng: coordinates.lng });
    map.setZoom(16);

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, coordinates]);

  return null;
}

export function OfficeLocation({
  address,
  metroStations,
  coordinates,
}: OfficeLocationProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-gray-900">{address}</h3>

      <div className="relative h-[300px] w-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <Map
          defaultZoom={16}
          defaultCenter={{ lat: coordinates.lat, lng: coordinates.lng }}
          gestureHandling="cooperative"
          disableDefaultUI={true}
          className="w-full h-full rounded-lg"
        >
          <OfficeMarker coordinates={coordinates} />
        </Map>
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
        >
          Agrandir
        </Button>
      </div>
    </div>
  );
}
