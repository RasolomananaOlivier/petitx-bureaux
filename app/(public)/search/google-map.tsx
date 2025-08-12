"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMapListSync } from "@/components/search/map-list-sync-provider";
import { OfficeWithRelations } from "@/features/offices/types";
import { Home, MapPin, Euro } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PARIS_CENTER = { lat: 48.8566, lng: 2.3522 };

function OfficeMarkersWithClusteringComponent() {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { filteredOffices, selectedOfficeId, hoveredOfficeId } =
    useMapListSync();

  useEffect(() => {
    if (!map || !selectedOfficeId) return;

    const selectedOffice = filteredOffices.find(
      (office) => office.id === selectedOfficeId
    );
    if (selectedOffice) {
      map.panTo({ lat: selectedOffice.lat, lng: selectedOffice.lng });
      map.setZoom(16);
    }
  }, [map, selectedOfficeId, filteredOffices]);

  return null;
}

const GoogleMap = () => {
  const { filteredOffices, selectedOfficeId, hoveredOfficeId } =
    useMapListSync();

  return (
    <div className="w-full h-full">
      <Map
        mapId="8bd9c5116791156d9b61917d"
        defaultZoom={13}
        defaultCenter={PARIS_CENTER}
        gestureHandling="cooperative"
        disableDefaultUI={true}
      >
        {/* <OfficeMarkersWithClusteringComponent />   */}
        {filteredOffices.map((office) => (
          <AdvancedMarkerWithCustomPin key={office.id} office={office} />
        ))}
      </Map>
    </div>
  );
};

const AdvancedMarkerWithCustomPin = ({
  office,
}: {
  office: OfficeWithRelations;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hoveredOfficeId } = useMapListSync();

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsExpanded(!isExpanded);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsExpanded(false);
    };

    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isExpanded]);

  const renderCustomPin = () => {
    return (
      <motion.div
        className="relative cursor-pointer"
        onClick={handleMarkerClick}
        initial={{ scale: 0.6, opacity: 0, y: 12 }}
        animate={{ scale: [0.6, 1.04, 1], opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          times: [0, 0.7, 1],
          ease: [0.25, 0.8, 0.25, 1],
        }}
      >
        <div
          className={cn(
            "bg-white shadow-xl shadow-black/25 rounded-lg overflow-hidden origin-center transition-all",
            hoveredOfficeId === office.id && "bg-gray-600"
          )}
        >
          {!isExpanded ? (
            <div className="p-2">
              <div
                className={cn(
                  "flex items-center gap-2 text-gray-800",
                  hoveredOfficeId === office.id && "text-white"
                )}
              >
                <Euro className="w-4 h-4" />
                <p className="text-sm font-semibold">
                  {office.priceCents
                    ? `${Math.round(office.priceCents / 100)}€`
                    : "Prix sur demande"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="p-2 min-w-[280px] max-w-[320px]"
              onClick={handleCardClick}
            >
              <div className="flex items-start gap-3">
                <img
                  src={office.photos[0].url}
                  alt={office.title}
                  className="rounded-lg w-24 h-24 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {office.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">
                      Arrondissement {office.arr}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Euro className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">
                        {office.priceCents
                          ? `${Math.round(office.priceCents / 100)}€`
                          : "Prix sur demande"}
                      </span>
                    </div>
                    {office.nbPosts && (
                      <span className="text-xs text-gray-500">
                        {office.nbPosts} postes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <motion.div
          className="absolute bottom-[2px] left-1/2 transform -translate-x-1/2 translate-y-full"
          animate={{
            scale: isExpanded ? 1.15 : 1,
            y: isExpanded ? -1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <svg
            viewBox="0 0 10 6"
            className={cn(
              "w-4 h-3 fill-white transition-all",
              hoveredOfficeId === office.id && "fill-gray-600"
            )}
          >
            <path d="M0,0 Q5,8 10,0 Z" />
          </svg>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <AdvancedMarker
      position={{ lat: office.lat, lng: office.lng }}
      title={office.title}
    >
      {renderCustomPin()}
    </AdvancedMarker>
  );
};

export default GoogleMap;
