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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { OfficeWithRelations } from "@/features/offices/types";
import { getSuggestedOffices } from "@/lib/api/offices";
import { useParams } from "next/navigation";
import { OfficeCard } from "@/components/sections/latest-office-section";

export function RelatedOffices() {
  const { slug } = useParams();
  const [api, setApi] = useState<CarouselApi>();

  const [offices, setOffices] = useState<OfficeWithRelations[]>([]);

  useEffect(() => {
    const fetchOffices = async () => {
      const offices = await getSuggestedOffices(slug as string);
      console.log(offices);
      setOffices(offices);
    };
    fetchOffices();
  }, []);

  if (offices.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4 lg:px-0">
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
          opts={{ align: "center" }}
          className={cn(
            "w-full flex-1 cursor-grab select-none max-w-md lg:max-w-6xl mx-auto"
          )}
        >
          <CarouselContent className="-ml-5 px-4">
            {offices.map((office) => (
              <CarouselItem
                key={office.id}
                className="basis-[80%] lg:basis-1/4"
              >
                <OfficeCard office={office} />
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
