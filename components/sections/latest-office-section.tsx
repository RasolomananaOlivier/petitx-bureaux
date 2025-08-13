"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { OfficeWithRelations } from "@/features/offices/types";
import Link from "next/link";

interface OfficeCardProps {
  office: OfficeWithRelations;
  isSelected?: boolean;
  isHovered?: boolean;
  onHover?: (office: OfficeWithRelations) => void;
  onLeave?: () => void;
  onClick?: (office: OfficeWithRelations) => void;
}

export function OfficeCard({
  office,
  onHover,
  onLeave,
  onClick,
}: OfficeCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    onSelect();
    api.on("select", onSelect);
  }, [api, onSelect]);

  const images =
    office.photos.length > 0
      ? office.photos.map((photo) => photo.url)
      : ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"];

  const handleMouseEnter = useCallback(() => {
    onHover?.(office);
  }, [office, onHover]);

  const handleMouseLeave = useCallback(() => {
    onLeave?.();
  }, [onLeave]);

  const handleClick = useCallback(() => {
    onClick?.(office);
  }, [office, onClick]);

  return (
    <Link href={`/${office.slug}`}>
      <div
        className={`relative bg-white rounded-xl border overflow-hidden transition-all duration-300 min-w-[300px] md:min-w-full cursor-pointer  hover:shadow-lg`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="relative group">
          <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
            <CarouselContent className="-ml-2">
              {images.map((src, idx) => (
                <CarouselItem key={idx} className="pl-0">
                  <img
                    src={src}
                    alt={`Image ${idx + 1} — ${office.title}`}
                    className="w-full h-48 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <Button
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                api?.scrollPrev();
              }}
              className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 left-4 transition-opacity rounded-full"
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                api?.scrollNext();
              }}
              className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 right-4 transition-opacity rounded-full"
            >
              <ChevronRight />
            </Button>
          </Carousel>

          <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
            Dispo
          </span>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {snaps.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  api?.scrollTo(idx);
                }}
                className={`rounded-full transition-all ${
                  idx === selectedIndex
                    ? "bg-white size-2"
                    : "bg-gray-400 size-1.5"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-gray-800">{office.title}</h3>
          <p className="text-gray-700">Paris {office.arr}ème arrondissement</p>
          <div className="flex text-gray-700 gap-2 items-center">
            <span>{office.nbPosts} postes</span>
            {office.officeServices.length > 0 && (
              <>
                <div className="h-1 w-1 bg-gray-700 rounded-full" />
                <span>{office.officeServices.length} services</span>
              </>
            )}
          </div>
          <p className="text-lg font-bold text-black mt-2">
            {(office.priceCents / 100).toLocaleString("fr-FR")} €{" "}
            <span className="font-normal text-base text-gray-700">
              par mois
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function LatestOfficesSection() {
  const [offices, setOffices] = useState<OfficeWithRelations[]>([]);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch("/api/offices?limit=4");
        const data = await response.json();

        setOffices(data.offices || []);
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    };

    fetchOffices();
  }, []);

  if (offices.length === 0) {
    return (
      <div className="lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8 p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-roslindale">
              Nos derniers bureaux
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des bureaux...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8 p-4 md:p-8 ">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-roslindale">
            Nos derniers bureaux
          </h1>
        </div>

        <div className="flex overflow-x-auto md:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 scrollbar-hide px-4 md:px-8">
          {offices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>

        <div className="mt-8 md:mt-4 flex justify-center lg:justify-end relative p-4 md:p-8">
          <Link href="/search">
            <Button
              variant="outline"
              size="lg"
              className="py-7 text-base border-primary text-primary hover:bg-transparent hover:text-primary px-6 w-full md:w-auto"
            >
              Explorer les bureaux
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
