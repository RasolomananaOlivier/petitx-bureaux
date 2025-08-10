"use client";

import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
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

// Type definition for office data
interface Office {
  id: number;
  location: string;
  subLocation: string;
  type: string;
  posts: number;
  area: number;
  price: number;
  images: string[];
  isAvailable: boolean;
}

// Dummy data
// Updated Office interface
interface Office {
  id: number;
  location: string;
  subLocation: string;
  type: string;
  posts: number;
  area: number;
  price: number;
  images: string[]; // now supports multiple image URLs
  isAvailable: boolean;
}

const officesData: Office[] = [
  {
    id: 1,
    location: "Rue de Saintonge, Paris 3",
    subLocation: "Bureau opéré",
    type: "Bureau privé",
    posts: 15,
    area: 97,
    price: 8500,
    images: [
      // Example office interiors from Pexels (free to use) :contentReference[oaicite:0]{index=0}
      "https://images.pexels.com/photos/37347/office-room-interior-rooms.jpg",
      "https://images.pexels.com/photos/97055/pexels-photo-97055.jpeg",
      "https://images.pexels.com/photos/714258/pexels-photo-714258.jpeg",
    ],
    isAvailable: true,
  },
  {
    id: 2,
    location: "Rue Vivienne, Paris 2",
    subLocation: "Bureau privé",
    type: "sous-location",
    posts: 18,
    area: 100,
    price: 8500,
    images: [
      // Pixabay royalty-free examples :contentReference[oaicite:1]{index=1}
      "https://cdn.pixabay.com/photo/2017/08/10/03/25/office-2615955_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/29/05/11/architecture-1868803_1280.jpg",
    ],
    isAvailable: true,
  },
  {
    id: 3,
    location: "Rue de la Vanne, Montrouge",
    subLocation: "Espace indépendant",
    type: "bail classique",
    posts: 20,
    area: 200,
    price: 2700,
    images: [
      "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg", // Pexels :contentReference[oaicite:2]{index=2}
      "https://cdn.pixabay.com/photo/2016/11/13/14/01/desk-1822458_1280.jpg", // Pixabay :contentReference[oaicite:3]{index=3}
    ],
    isAvailable: true,
  },
  {
    id: 4,
    location: "Rue des Cuirassiers, Lyon 3",
    subLocation: "Bureau privé",
    type: "coworking",
    posts: 25,
    area: 124,
    price: 15000,
    images: [
      "https://images.pexels.com/photos/3862134/pexels-photo-3862134.jpeg", // Pexels :contentReference[oaicite:4]{index=4}
      "https://cdn.pixabay.com/photo/2015/03/26/09/54/meeting-690317_1280.jpg", // Pixabay :contentReference[oaicite:5]{index=5}
    ],
    isAvailable: true,
  },
];

// OfficeCard component

function OfficeCard({ office }: { office: Office }) {
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

  return (
    <div className="relative bg-white rounded-xl border overflow-hidden">
      <div className="relative group">
        <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
          <CarouselContent>
            {office.images.map((src, idx) => (
              <CarouselItem key={idx}>
                <img
                  src={src}
                  alt={`Image ${idx + 1} — ${office.location}`}
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

        {office.isAvailable && (
          <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
            Dispo
          </span>
        )}

        {/* Dot indicators */}
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

      {/* Text content */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-gray-800">{office.location}</h3>
        <p className="text-gray-700">
          {office.subLocation} — {office.type}
        </p>
        <div className="flex text-gray-700 gap-2 items-center">
          <span>{office.posts} postes</span>
          <div className="h-1 w-1 bg-gray-700 rounded-full" />
          <span>{office.area} m²</span>
        </div>
        <p className="text-lg font-bold text-gray-700">
          {office.price.toLocaleString("fr-FR")} €{" "}
          <span className="font-normal text-gray-700">HT /mois</span>
        </p>
      </div>
    </div>
  );
}
// LatestOfficesSection component
export default function LatestOfficesSection() {
  const [offices] = useState<Office[]>(officesData);

  return (
    <div className="p-8 lg:p-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 font-roslindale">
            Nos derniers bureaux
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
          {offices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-center lg:justify-end relative">
          <Button
            variant="outline"
            size="lg"
            className="py-7 text-base border-primary text-primary hover:bg-transparent hover:text-primary px-6"
          >
            Explorer les bureaux
          </Button>
        </div>
      </div>
    </div>
  );
}
