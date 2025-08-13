"use client";
import React, { useEffect } from "react";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMapListSync } from "@/components/search/map-list-sync-provider";
import { OfficeWithRelations } from "@/features/offices/types";
import { MapPin, Euro } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { MAP_ID, PARIS_CENTER } from "@/lib/utils/constants";

const GoogleMap = () => {
  const { filteredOffices, expandedOfficeId } = useMapListSync();

  const sortedOffices = [...filteredOffices].sort((a, b) => {
    if (a.id === expandedOfficeId) return 1;
    if (b.id === expandedOfficeId) return -1;
    return 0;
  });

  return (
    <div className="w-full h-full">
      <Map
        mapId={MAP_ID}
        defaultZoom={13}
        defaultCenter={PARIS_CENTER}
        gestureHandling="cooperative"
        disableDefaultUI={true}
      >
        {sortedOffices.map((office) => (
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
  const {
    hoveredOfficeId,
    expandedOfficeId,
    setSelectedOfficeId,
    setExpandedOfficeId,
  } = useMapListSync();

  const isExpanded = expandedOfficeId === office.id;

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isExpanded) {
      setExpandedOfficeId(null);
      setSelectedOfficeId(office.id);
    } else {
      setExpandedOfficeId(office.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setExpandedOfficeId(null);
    };

    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isExpanded, setExpandedOfficeId]);

  const renderCustomPin = () => {
    return (
      <div
        className={cn(
          "relative cursor-pointer",
          isExpanded && "relative z-[9999] transform translate-z-0"
        )}
        style={isExpanded ? { transform: "translateZ(1px)" } : undefined}
        onClick={handleMarkerClick}
      >
        <div
          className={cn(
            "bg-white shadow-xl shadow-black/25 rounded-lg overflow-hidden origin-center transition-all",
            hoveredOfficeId === office.id && "bg-gray-600",
            isExpanded && "relative z-[9999]"
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
            <Link href={`/${office.slug}`}>
              <div
                className="p-2 min-w-[280px] max-w-[320px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleCardClick}
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={office.photos[0]?.url || "/open_space.webp"}
                    alt={office.title}
                    width={96}
                    height={96}
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
            </Link>
          )}
        </div>

        <div
          className={cn(
            "absolute bottom-[9px] left-1/2 transform -translate-x-1/2 translate-y-full size-[14px] rotate-[135deg] bg-white rounded-sm",
            isExpanded && "z-[9999]",
            hoveredOfficeId === office.id && "bg-gray-600"
          )}
        ></div>
      </div>
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
