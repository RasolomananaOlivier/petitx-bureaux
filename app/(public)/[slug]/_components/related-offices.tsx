"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RelatedOffice {
  id: string;
  slug?: string;
  title: string;
  address: string;
  workstations: number;
  surface: number;
  price: number;
  image: string;
  available: boolean;
}

interface RelatedOfficesProps {
  offices: RelatedOffice[];
}

function RelatedOfficeCard({ office }: { office: RelatedOffice }) {
  return (
    <Link href={`/${office.slug || office.id}`}>
      <Card className="border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
              <Image
                src={office.image}
                alt={office.title}
                fill
                className="object-cover"
              />
              {office.available && (
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Dispo
                  </span>
                </div>
              )}
              <button
                className="absolute top-3 right-3 p-1 bg-white/80 rounded-full hover:bg-white"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{office.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{office.address}</p>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>
                  {office.workstations} postes - {office.surface} m²
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {office.price.toLocaleString()} € HT/mois
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function RelatedOffices({ offices }: RelatedOfficesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) setIsGrabbing(true);
  };
  const handleMouseUp = () => setIsGrabbing(false);

  if (offices.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Ces bureaux pourraient vous plaire
      </h2>

      <div className="flex gap-2 justify-center max-w-7xl mx-auto">
        <div className="lg:flex items-center hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => api?.scrollPrev()}
            aria-label="Scroll previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <Carousel
          opts={{ loop: true, align: "start" }}
          className={cn(
            "w-full flex-1 cursor-grab select-none max-w-md lg:max-w-6xl mx-auto",
            isGrabbing && "cursor-grabbing"
          )}
          setApi={setApi}
          onContextMenu={(e) => e.preventDefault()}
        >
          <CarouselContent
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {offices.map((office) => (
              <CarouselItem key={office.id} className="basis-1/2 lg:basis-1/3">
                <RelatedOfficeCard office={office} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="lg:flex items-center hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => api?.scrollNext()}
            aria-label="Scroll next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
