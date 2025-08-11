import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import {
  Search,
  Building2,
  Users,
  MapPin,
  Star,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Navbar from "@/components/navbar";
import Image from "next/image";
import PostsBadge from "../posts-badge";

type Props = {
  title: string;
  description: string;
  image: string;
  posts: string;
  buttonText: string;
  buttonLink: string;
};
const OfficeCategoryCard = ({
  title,
  description,
  image,
  posts,
  buttonText,
  buttonLink,
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
        <Button
          variant="ghost"
          className="underline hover:bg-transparent p-0 min-h-[44px] text-sm"
        >
          {buttonText} <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default function OfficeCategoriesSection() {
  return (
    <section className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-15 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-9">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-roslindale leading-tight">
            Tous les bureaux sont sur PetitsBureaux
          </h2>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2 items-stretch h-[450px]">
            {/* Cards for mobile horizontal scroll */}
            <OfficeCategoryCard
              title="Bureau opéré / Immeuble entier"
              description="Lieu rien que pour votre entreprise : vos collaborateurs et visiteurs vivent votre culture d'entreprise dès l'accueil."
              image="/building.webp"
              posts="70 + postes"
              buttonText="Nous contacter"
              buttonLink="/offices/operated"
            />
            <OfficeCategoryCard
              title="Étage / plateau indépendant"
              description="Étage réservé à vos équipes avec salles de réunion, cuisine, etc. Accédez aussi aux services communs d'un coworking ou immeuble partagé."
              image="/independent.webp"
              posts="20 - 100 postes"
              buttonText="Voir les bureaux"
              buttonLink="/offices/operated"
            />
            <OfficeCategoryCard
              title="Bureau privé clé en main"
              description="Bureau équipé et fermé au sein d'un espace de coworking ou chez une entreprise classique. Bénéficiez des salles de réunion et services partagés."
              image="/private.webp"
              posts="1 - 40 postes"
              buttonText="Voir les bureaux"
              buttonLink="/offices/operated"
            />
            <OfficeCategoryCard
              title="Poste en open Space"
              description="Postes dédiés ou nomades dans un espace ouvert et partagé : budget avantageux, mutualisation des services et échanges renforcés."
              image="/open_space.webp"
              posts="1 - 10 postes"
              buttonText="Voir les bureaux"
              buttonLink="/offices/operated"
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
              buttonLink="/offices/operated"
            />

            {/* Card 2: Étage / plateau indépendant */}
            <OfficeCategoryCard
              title="Étage / plateau indépendant"
              description="Étage réservé à vos équipes avec salles de réunion, cuisine, etc. Accédez aussi aux services communs d'un coworking ou immeuble partagé."
              image="/independent.webp"
              posts="20 - 100 postes"
              buttonText="Voir les bureaux"
              buttonLink="/offices/operated"
            />

            {/* Card 3: Bureau privé clé en main */}
            <OfficeCategoryCard
              title="Bureau privé clé en main"
              description="Bureau équipé et fermé au sein d'un espace de coworking ou chez une entreprise classique. Bénéficiez des salles de réunion et services partagés."
              image="/private.webp"
              posts="1 - 40 postes"
              buttonText="Voir les bureaux"
              buttonLink="/offices/operated"
            />

            {/* Card 4: Poste en open Space */}
            <OfficeCategoryCard
              title="Poste en open Space"
              description="Postes dédiés ou nomades dans un espace ouvert et partagé : budget avantageux, mutualisation des services et échanges renforcés."
              image="/open_space.webp"
              posts="1 - 10 postes"
              buttonText="Voir les bureaux"
              buttonLink="/offices/operated"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
