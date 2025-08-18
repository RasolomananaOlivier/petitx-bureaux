"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FullGalleryModal } from "./full-gallery-modal";

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
            <div
              key={index}
              className={`w-full  overflow-hidden rounded-md transition-all relative cursor-pointer `}
            >
              {imageCount > 5 && index === 3 && (
                <FullGalleryModal
                  images={validImages}
                  trigger={
                    <Button className=" z-50 absolute bottom-4 right-4 overflow-hidden rounded-md bg-white hover:bg-white text-black">
                      <Eye className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">
                        +{imageCount - 5} photos
                      </span>
                    </Button>
                  }
                />
              )}
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
  };

  return (
    <div className="space-y-4">
      {renderDesktopLayout()}

      <div className="relative lg:hidden">
        <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
          <CarouselContent className="-ml-2">
            {validImages.slice(0, 5).map((src, idx) => (
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
            {snaps.slice(0, 5).map((_, idx) => (
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

        {imageCount > 5 && (
          <div className="absolute top-4 right-4">
            <FullGalleryModal
              images={validImages}
              trigger={
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir tout ({imageCount})
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
