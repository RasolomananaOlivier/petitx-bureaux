"use client";
import React, { useEffect, useState, useRef } from "react";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMapListSync } from "@/components/search/map-list-sync-provider";
import { OfficeWithRelations } from "@/features/offices/types";
import { MapPin, Euro, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { MAP_ID, PARIS_CENTER } from "@/lib/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";

const GoogleMap = () => {
  const { filteredOffices, expandedOfficeId } = useMapListSync();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const sortedOffices = [...filteredOffices].sort((a, b) => {
    if (a.id === expandedOfficeId) return 1;
    if (b.id === expandedOfficeId) return -1;
    return 0;
  });

  return (
    <div ref={mapContainerRef} className="w-full h-full relative">
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

  const [cardPosition, setCardPosition] = useState<"above" | "below" | null>(
    null
  );
  const markerRef = useRef<HTMLDivElement>(null);

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

  const handleCloseCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedOfficeId(null);
  };

  useEffect(() => {
    if (isExpanded && markerRef.current) {
      // Calculate position immediately before showing the card
      const markerRect = markerRef.current.getBoundingClientRect();

      if (markerRect && !(markerRect.top === 0 && markerRect.bottom === 0)) {
        const cardHeight = 200;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - markerRect.bottom;

        const newPosition = spaceBelow >= cardHeight ? "below" : "above";
        setCardPosition(newPosition);
      } else {
        // Fallback if marker not positioned yet
        setTimeout(() => {
          const markerRect = markerRef.current?.getBoundingClientRect();
          if (
            markerRect &&
            !(markerRect.top === 0 && markerRect.bottom === 0)
          ) {
            const cardHeight = 200;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - markerRect.bottom;

            const newPosition = spaceBelow >= cardHeight ? "below" : "above";
            setCardPosition(newPosition);
          }
        }, 10);
      }
    } else if (!isExpanded) {
      setCardPosition(null);
    }
  }, [isExpanded]);

  const bgColor =
    hoveredOfficeId === office.id
      ? "bg-gray-600 text-white"
      : "bg-white text-gray-800";

  return (
    <AdvancedMarker
      position={{ lat: office.lat, lng: office.lng }}
      title={office.title}
    >
      <div
        ref={markerRef}
        className="relative cursor-pointer"
        onClick={handleMarkerClick}
      >
        <motion.div
          className={cn(
            "shadow-xl shadow-black/25 rounded-lg overflow-hidden origin-center transition-colors duration-200",
            bgColor
          )}
        >
          <div className="p-2">
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4" />
              <p className="text-sm font-semibold">
                {office.priceCents
                  ? `${Math.round(office.priceCents / 100)}€`
                  : "Prix sur demande"}
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="sync">
          {isExpanded && cardPosition && (
            <motion.div
              key={`card-${office.id}-${cardPosition}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2 z-50",
                cardPosition === "above" ? "bottom-full mb-2" : "top-full mt-2"
              )}
              onClick={handleCardClick}
            >
              <Card className="w-80 shadow-xl border-0">
                <CardHeader className="pb-3 relative">
                  <button
                    onClick={handleCloseCard}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="flex items-start gap-3">
                    <Image
                      src={office.photos[0]?.url || "/open_space.webp"}
                      alt={office.title}
                      width={80}
                      height={80}
                      className="rounded-lg w-20 h-20 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight truncate pr-2">
                        {office.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          Arrondissement {office.arr}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-semibold text-green-600">
                          {office.priceCents
                            ? `${Math.round(office.priceCents / 100)} €`
                            : "Prix sur demande"}
                        </span>
                      </div>
                      {office.nbPosts && (
                        <Badge variant="secondary" className="ml-2">
                          {office.nbPosts} postes
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/office/${office.slug}`}
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                      onClick={handleCardClick}
                    >
                      Voir détails
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdvancedMarker>
  );
};

export default GoogleMap;
