"use client";

import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface OfficeLocationProps {
  address: string;
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

export function OfficeLocation({ address, coordinates }: OfficeLocationProps) {
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
