"use client";

import Image from "next/image";
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

const FALLBACK_IMAGE = "/hero.webp";

export function OfficeGallery({ images }: OfficeGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  const imageCount = validImages.length;

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const renderDesktopLayout = () => {
    if (imageCount === 1) {
      return (
        <div className="hidden lg:block aspect-video max-h-[350px] w-full relative overflow-hidden rounded-lg">
          <Image
            src={validImages[0]}
            alt="Office space"
            fill
            className="object-cover"
            priority
            onError={handleImageError}
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="hidden lg:grid grid-cols-5 gap-4 max-h-[350px] w-full">
          <div className="aspect-video relative overflow-hidden rounded-lg col-span-3 max-h-[350px] w-full">
            <Image
              src={validImages[0]}
              alt="Office space"
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
          </div>
          <div className="relative overflow-hidden rounded-lg col-span-2 ">
            <Image
              src={validImages[1]}
              alt="Office space"
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </div>
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="hidden lg:grid grid-cols-2 gap-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={validImages[0]}
              alt="Office space"
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
          </div>
          <div className="grid grid-rows-2 gap-4">
            {validImages.slice(1, 3).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Office thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="hidden lg:grid grid-cols-2 gap-4">
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={validImages[0]}
            alt="Office space"
            fill
            className="object-cover"
            priority
            onError={handleImageError}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {validImages.slice(1, 5).map((image, index) => (
            <button
              key={index}
              className={`w-full aspect-video relative overflow-hidden rounded-md transition-all hover:opacity-80`}
            >
              <Image
                src={image}
                alt={`Office thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
          {imageCount > 5 && (
            <div className="w-full aspect-video relative overflow-hidden rounded-md bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">
                +{imageCount - 5} photos
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderDesktopLayout()}

      <div className="relative lg:hidden">
        <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
          <CarouselContent className="-ml-2">
            {validImages.map((src, idx) => (
              <CarouselItem key={idx} className="pl-0">
                <Image
                  src={src}
                  alt="Office space"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover"
                  onError={handleImageError}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {imageCount > 1 && (
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
        )}
      </div>
    </div>
  );
}
