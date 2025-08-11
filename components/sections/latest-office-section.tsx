"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { OfficeWithRelations } from "@/features/offices/types";

export function OfficeCard({ office }: { office: OfficeWithRelations }) {
  const [api, setApi] = useState<CarouselApi | undefined>();
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

  return (
    <div className="relative bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 min-w-[300px]">
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
            onClick={() => api?.scrollPrev()}
            className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 left-4 transition-opacity rounded-full"
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => api?.scrollNext()}
            className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 right-4 transition-opacity rounded-full"
          >
            <ChevronRight />
          </Button>
        </Carousel>

        <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
          Dispo
        </span>

        <div className="absolute bottom-2 w-full flex justify-center mt-2 space-x-1 pb-2 items-center">
          {snaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
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
          <span className="font-normal text-base text-gray-700">par mois</span>
        </p>
      </div>
    </div>
  );
}

export default function LatestOfficesSection() {
  const [offices, setOffices] = useState<OfficeWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestOffices() {
      try {
        const response = await fetch(
          "/api/offices?limit=4&sortBy=created_at&sortOrder=desc"
        );
        const data = await response.json();
        setOffices(data.offices);
      } catch (error) {
        console.error("Error fetching latest offices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestOffices();
  }, []);

  if (loading) {
    return (
      <div className="lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 p-4 md:p-8 ">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-roslindale">
              Nos derniers bureaux
            </h1>
          </div>
          <div className="flex overflow-x-auto md:grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 scrollbar-hide p-0 md:p-8 ">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border overflow-hidden animate-pulse min-w-[300px]"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:p-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-10 p-4 md:p-8 ">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-roslindale">
            Nos derniers bureaux
          </h1>
        </div>

        <div className="flex overflow-x-auto md:grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 scrollbar-hide px-4 md:px-8 ">
          {offices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>

        <div className="mt-8 md:mt-4 flex justify-center lg:justify-end relative p-4 md:p-8">
          <Button
            variant="outline"
            size="lg"
            className="py-7 text-base border-primary text-primary hover:bg-transparent hover:text-primary px-6 w-full md:w-auto"
          >
            Explorer les bureaux
          </Button>
        </div>
      </div>
    </div>
  );
}
