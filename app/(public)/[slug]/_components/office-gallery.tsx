"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface OfficeGalleryProps {
  images: string[];
}

export function OfficeGallery({ images }: OfficeGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <div className="lg:grid grid-cols-2 gap-4">
      <div className="hidden lg:block col-span-1 aspect-video relative overflow-hidden rounded-lg">
        <Image
          src={images[0]}
          alt="Office space"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="hidden col-span-1 lg:grid grid-cols-2 gap-4">
        {images.slice(1, 5).map((image, index) => (
          <button
            key={index}
            className={`w-full aspect-video relative overflow-hidden rounded-md transition-all ${"hover:opacity-80"}`}
          >
            <Image
              src={image}
              alt={`Office thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative lg:hidden">
        <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
          <CarouselContent className="-ml-2">
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="pl-0">
                <img
                  src={src}
                  alt="Office space"
                  className="w-full h-64 object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

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
    </div>
  );
}
