"use client";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Button } from "../ui/button";
import PostsBadge from "../posts-badge";
import { cn } from "@/lib/utils";

type Testimonial = {
  title: string;
  postes: number;
  postesType?: "badge" | "postsBadge"; // choisir quel composant afficher
  quote: string;
  author: string;
  authorRole: string;
};

function TestimonialCard({
  title,
  postes,
  quote,
  author,
  authorRole,
}: Testimonial) {
  return (
    <Card>
      <CardHeader className="pb-4 pt-5 px-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="">{title}</CardTitle>
          <div>
            <PostsBadge text={`${postes} postes`} className="font-bold" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-5">
        <blockquote className="text-gray-700 mb-4 font-medium">
          "{quote}"
        </blockquote>
        <div className="text-sm">
          <span className="font-semibold text-gray-900">{author}</span>
          <span className="text-gray-500"> {authorRole}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsCarouselSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) setIsGrabbing(true);
  };
  const handleMouseUp = () => setIsGrabbing(false);

  const testimonials: Testimonial[] = [
    {
      title: "Bureau fermé",
      postes: 15,
      postesType: "postsBadge",
      quote:
        "PetitsBureaux nous a permis de trouver l'espace parfait pour notre équipe. Le processus était simple et rapide, et l'expert dédié a vraiment compris nos besoins.",
      author: "Andrea",
      authorRole: "Manager @ Price Hubble",
    },
    {
      title: "Espace indépendant",
      postes: 36,
      quote:
        "Service client exceptionnel et bureaux de qualité. Nous recommandons vivement PetitsBureaux pour toute entreprise en recherche d'espace.",
      author: "Bruno",
      authorRole: "CEO @ Yusco",
    },
    {
      title: "Bureau privé",
      postes: 14,
      quote:
        "Flexibilité et transparence des prix. Parfait pour notre équipe en croissance. L'équipe PetitsBureaux a été très réactive.",
      author: "Jérôme",
      authorRole: "CEO @ Allday",
    },
    {
      title: "Immeuble entier",
      postes: 75,
      quote:
        "Un accompagnement personnalisé de A à Z. PetitsBureaux a su nous proposer des solutions adaptées à nos besoins spécifiques.",
      author: "Clémentine",
      authorRole: "Directrice relations clients @ Cap4 Lab",
    },
    // Ajoute ici 3 autres testimonials pour un total de 7
    {
      title: "Bureau flexible",
      postes: 22,
      quote:
        "La flexibilité offerte par PetitsBureaux nous a permis de nous adapter rapidement aux changements dans notre équipe.",
      author: "Sophie",
      authorRole: "HR Manager @ Innovatech",
    },
    {
      title: "Espace collaboratif",
      postes: 40,
      quote:
        "L'espace collaboratif a boosté notre productivité et renforcé la cohésion de notre équipe.",
      author: "Marc",
      authorRole: "CTO @ TechFlow",
    },
    {
      title: "Bureaux design",
      postes: 10,
      quote:
        "Un cadre design et moderne qui inspire notre créativité au quotidien.",
      author: "Emma",
      authorRole: "Creative Director @ DesignPro",
    },
  ];

  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-4 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-0 md:mb-10 font-roslindale">
            5 000 entreprises ont trouvé leurs bureaux avec PetitsBureaux
          </h2>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-medium text-gray-900 text-nowrap">
              Excellent 4.9 sur 5
            </span>
            <Star className="h-5 w-5 fill-green-500 text-green-500" />
            <span className="text-sm font-medium text-gray-900">
              Trustpilot
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-center  max-w-6xl mx-auto">
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
              "w-full flex-1 cursor-grab select-none max-w-md lg:max-w-6xl mx-auto ",
              isGrabbing && "cursor-grabbing"
            )}
            setApi={setApi}
            onContextMenu={(e) => e.preventDefault()}
          >
            <CarouselContent
              className=""
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="basis-1/2 lg:basis-1/4">
                  <TestimonialCard {...t} />
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
    </section>
  );
}
