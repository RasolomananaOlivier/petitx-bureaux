"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface FullGalleryModalProps {
  images: string[];
  trigger: React.ReactNode;
}

const FALLBACK_IMAGE = "/hero.webp";

export function FullGalleryModal({ images, trigger }: FullGalleryModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const validImages = images.length > 0 ? images : [FALLBACK_IMAGE];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const handleSelect = () => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  };

  useEffect(() => {
    if (!api) return;
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="h-screen p-0  border-0 rounded-none min-w-screen">
        <div className="relative w-full h-full flex flex-col">
          <div className="flex-1 relative">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "center",
              }}
              onSelect={handleSelect}
            >
              <CarouselContent>
                {validImages.map((src, idx) => (
                  <CarouselItem key={idx} className="h-full">
                    <div className="flex items-center justify-center p-4 h-screen ">
                      <Image
                        src={src}
                        alt={`Office image ${idx + 1}`}
                        width={1100}
                        height={800}
                        onError={handleImageError}
                        className="lg:aspect-video relative object-cover rounded-xl"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-8 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:text-white hover:bg-black/70 border-0 h-12 w-12" />
              <CarouselNext className="right-8 top-1/2 transform -translate-y-1/2 bg-black/50 text-white  hover:text-white hover:bg-black/70 border-0 h-12 w-12" />
            </Carousel>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {current + 1} / {validImages.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
