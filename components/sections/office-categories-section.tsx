"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import PostsBadge from "@/components/posts-badge";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  image: string;
  posts: string;
  buttonText: string;
  searchParams?: string;
};

const OfficeCategoryCard = ({
  title,
  description,
  image,
  posts,
  buttonText,
  searchParams = "",
}: Props) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col h-full w-[280px] md:w-full flex-shrink-0 self-stretch">
      <div className="relative w-full aspect-[300/144] overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 280px, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <CardHeader className="pb-4 group-hover:bg-gray-50 transition-colors px-4">
        <CardTitle className="text-base sm:text-lg leading-tight">
          {title}
        </CardTitle>
        <PostsBadge text={posts} className="mt-2" />
      </CardHeader>

      <CardContent className="pt-0 group-hover:bg-gray-50 transition-colors px-4 flex-1 flex flex-col">
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {description}
        </p>
      </CardContent>

      <div className="mt-auto flex justify-end px-4 pb-4 group-hover:bg-gray-50 flex-shrink-0">
        <Link href={`/search${searchParams}`}>
          <Button
            variant="ghost"
            className="underline hover:bg-transparent p-0 min-h-[44px] text-sm"
          >
            {buttonText} <ArrowRight className="size-4 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default function OfficeCategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-roslindale">
            Types de bureaux
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos différents types de bureaux adaptés à tous les besoins
            et toutes les tailles d'entreprise
          </p>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            <OfficeCategoryCard
              title="Bureau opéré / Immeuble entier"
              description="Lieu rien que pour votre entreprise : vos collaborateurs et visiteurs vivent votre culture d'entreprise dès l'accueil."
              image="/building.webp"
              posts="70 + postes"
              buttonText="Nous contacter"
              searchParams="?minPosts=70"
            />
            <OfficeCategoryCard
              title="Étage / plateau indépendant"
              description="Étage réservé à vos équipes avec salles de réunion, cuisine, etc. Accédez aussi aux services communs d'un coworking ou immeuble partagé."
              image="/independent.webp"
              posts="20 - 100 postes"
              buttonText="Voir les bureaux"
              searchParams="?minPosts=20&maxPosts=100"
            />
            <OfficeCategoryCard
              title="Bureau privé clé en main"
              description="Bureau équipé et fermé au sein d'un espace de coworking ou chez une entreprise classique. Bénéficiez des salles de réunion et services partagés."
              image="/private.webp"
              posts="1 - 40 postes"
              buttonText="Voir les bureaux"
              searchParams="?minPosts=1&maxPosts=40"
            />
            <OfficeCategoryCard
              title="Poste en open Space"
              description="Postes dédiés ou nomades dans un espace ouvert et partagé : budget avantageux, mutualisation des services et échanges renforcés."
              image="/open_space.webp"
              posts="1 - 10 postes"
              buttonText="Voir les bureaux"
              searchParams="?minPosts=1&maxPosts=10"
            />
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:block px-4 sm:px-6 lg:px-9">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Bureau opéré / Immeuble entier */}
            <OfficeCategoryCard
              title="Bureau opéré / Immeuble entier"
              description="Lieu rien que pour votre entreprise : vos collaborateurs et visiteurs vivent votre culture d'entreprise dès l'accueil."
              image="/building.webp"
              posts="70 + postes"
              buttonText="Nous contacter"
              searchParams="?minPosts=70"
            />

            {/* Card 2: Étage / plateau indépendant */}
            <OfficeCategoryCard
              title="Étage / plateau indépendant"
              description="Étage réservé à vos équipes avec salles de réunion, cuisine, etc. Accédez aussi aux services communs d'un coworking ou immeuble partagé."
              image="/independent.webp"
              posts="20 - 100 postes"
              buttonText="Voir les bureaux"
              searchParams="?minPosts=20&maxPosts=100"
            />

            {/* Card 3: Bureau privé clé en main */}
            <OfficeCategoryCard
              title="Bureau privé clé en main"
              description="Bureau équipé et fermé au sein d'un espace de coworking ou chez une entreprise classique. Bénéficiez des salles de réunion et services partagés."
              image="/private.webp"
              posts="1 - 40 postes"
              buttonText="Voir les bureaux"
              searchParams="?minPosts=1&maxPosts=40"
            />

            {/* Card 4: Poste en open Space */}
            <OfficeCategoryCard
              title="Poste en open Space"
              description="Postes dédiés ou nomades dans un espace ouvert et partagé : budget avantageux, mutualisation des services et échanges renforcés."
              image="/open_space.webp"
              posts="1 - 10 postes"
              buttonText="Voir les bureaux"
              searchParams="?minPosts=1&maxPosts=10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
