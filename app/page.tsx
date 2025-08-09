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

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="text-xl font-bold">
              PetitsBureaux
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/map" className="hover:text-primary transition-colors">
              Carte
            </Link>
            {!hasEnvVars ? null : <AuthButton />}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center my-8">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl mx-4"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')",
          }}
        />

        {/* White Content Box */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Faisons équipe pour trouver vos{" "}
                <span className="text-primary">bureaux</span>
              </h1>

              {/* Key Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Un expert dédié à vos côtés
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    100% des bureaux, 100% à jour
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Service gratuit</span>
                </div>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Excellent 4.9 sur 5 Trustpilot
                  </span>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8 py-3 text-base">
                  <Search className="h-4 w-4 mr-2" />
                  Voir 8 286 annonces
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Confier ma recherche
                </Button>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="mt-6">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Photo Credit */}
        <div className="absolute bottom-4 right-4 text-white/60 text-xs">
          Photo by{" "}
          <a
            href="https://unsplash.com/@joshuaearle?utm_source=openai&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Joshua Earle
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/?utm_source=openai&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Unsplash
          </a>
        </div>
      </section>

      {/* Partners Infinite Scroll */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center gap-12 px-6">
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-xl font-bold text-gray-400">
                    Growth Room
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-xl font-bold text-gray-400">VINCI</span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-medium text-gray-400">
                    pass Culture
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-medium text-gray-400">
                    Too Good To Go
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-lg font-bold text-gray-400">
                    Cyberlift
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <svg
                    className="w-16 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 7.8C23.6 7.3 22.9 7 22.2 7H1.8C1.1 7 .4 7.3 0 7.8v8.4c.4.5 1.1.8 1.8.8h20.4c.7 0 1.4-.3 1.8-.8V7.8zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
                  </svg>
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-12 px-6">
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-xl font-bold text-gray-400">
                    Growth Room
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-xl font-bold text-gray-400">VINCI</span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-medium text-gray-400">
                    pass Culture
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-medium text-gray-400">
                    Too Good To Go
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-lg font-bold text-gray-400">
                    Cyberlift
                  </span>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <svg
                    className="w-16 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 7.8C23.6 7.3 22.9 7 22.2 7H1.8C1.1 7 .4 7.3 0 7.8v8.4c.4.5 1.1.8 1.8.8h20.4c.7 0 1.4-.3 1.8-.8V7.8zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Tous les bureaux sont sur PetitsBureaux
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Bureau opéré / Immeuble entier */}
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-white opacity-80" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  Bureau opéré / Immeuble entier
                </CardTitle>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Users className="h-4 w-4" />
                  <span>70 + postes</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Lieu rien que pour votre entreprise : vos collaborateurs et
                  visiteurs vivent votre culture d'entreprise dès l'accueil.
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  Nous contacter →
                </Button>
              </CardContent>
            </Card>

            {/* Card 2: Étage / plateau indépendant */}
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-white opacity-80" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  Étage / plateau indépendant
                </CardTitle>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Users className="h-4 w-4" />
                  <span>20 - 100 postes</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Étage réservé à vos équipes avec salles de réunion, cuisine,
                  etc. Accédez aussi aux services communs d'un coworking ou
                  immeuble partagé.
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  Voir les bureaux →
                </Button>
              </CardContent>
            </Card>

            {/* Card 3: Bureau privé clé en main */}
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-white opacity-80" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  Bureau privé clé en main
                </CardTitle>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Users className="h-4 w-4" />
                  <span>1 - 40 postes</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Bureau équipé et fermé au sein d'un espace de coworking ou
                  chez une entreprise classique. Bénéficiez des salles de
                  réunion et services partagés.
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  Voir les bureaux →
                </Button>
              </CardContent>
            </Card>

            {/* Card 4: Poste en open Space */}
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white opacity-80" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Poste en open Space</CardTitle>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Users className="h-4 w-4" />
                  <span>1 - 10 postes</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Postes dédiés ou nomades dans un espace ouvert et partagé :
                  budget avantageux, mutualisation des services et échanges
                  renforcés.
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  Voir les bureaux →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            PetitsBureaux est partenaire de tous les acteurs du bureau flexible
          </h2>

          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-8">
            {/* Row 1 */}
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">wework</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">morning</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">DESKEO</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">WOJO</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-white text-xs font-bold">SW</span>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  STARTWAY
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <span className="text-lg font-bold text-gray-800">Flow</span>
                <div className="text-xs text-gray-600">bureaux all-in</div>
              </div>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">
                NEWTON OFFICES
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">kwərk</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-800 mx-auto mb-1"></div>
                <span className="text-sm font-bold text-gray-800">
                  les nouveaux bureaux
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">
                myflexoffice
              </span>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-800 transform rotate-45 mx-auto mb-1"></div>
                <span className="text-lg font-bold text-gray-800">SPACES.</span>
              </div>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">w</span>
              </div>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">wellio</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-gray-800">BUREAUX+</span>
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-12">
            ... et bien d'autres que vous ne connaissez pas encore !
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-base border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Confier ma recherche
            </Button>
            <Button size="lg" className="px-8 py-3 text-base">
              <Search className="h-4 w-4 mr-2" />
              Voir 8 286 annonces
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              5 000 entreprises ont trouvé leurs bureaux avec PetitsBureaux
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-gray-900">
                Excellent 4.9 sur 5
              </span>
              <Star className="h-5 w-5 fill-green-500 text-green-500" />
              <span className="text-lg font-medium text-gray-900">
                Trustpilot
              </span>
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {/* Testimonial 1 */}
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Bureau fermé</CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        15 postes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <blockquote className="text-gray-600 mb-4 italic">
                      "PetitsBureaux nous a permis de trouver l'espace parfait
                      pour notre équipe. Le processus était simple et rapide, et
                      l'expert dédié a vraiment compris nos besoins."
                    </blockquote>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        Andrea
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        Manager @ Price Hubble
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Testimonial 2 */}
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        Espace indépendant
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        36 postes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <blockquote className="text-gray-600 mb-4 italic">
                      "Service client exceptionnel et bureaux de qualité. Nous
                      recommandons vivement PetitsBureaux pour toute entreprise
                      en recherche d'espace."
                    </blockquote>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Bruno</span>
                      <span className="text-gray-500"> CEO @ Yusco</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Testimonial 3 */}
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Bureau privé</CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        14 postes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <blockquote className="text-gray-600 mb-4 italic">
                      "Flexibilité et transparence des prix. Parfait pour notre
                      équipe en croissance. L'équipe PetitsBureaux a été très
                      réactive."
                    </blockquote>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        Jérôme
                      </span>
                      <span className="text-gray-500"> CEO @ Allday</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Testimonial 4 */}
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Immeuble entier</CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        75 postes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <blockquote className="text-gray-600 mb-4 italic">
                      "Un accompagnement personnalisé de A à Z. PetitsBureaux a
                      su nous proposer des solutions adaptées à nos besoins
                      spécifiques."
                    </blockquote>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        Clémentine
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        Directrice relations clients @ Cap4 Lab
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>

            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative translate-x-0 translate-y-0 left-auto right-auto top-auto bottom-auto" />
              <CarouselNext className="relative translate-x-0 translate-y-0 left-auto right-auto top-auto bottom-auto" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Bureaux disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">
                Arrondissements couverts
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">
                Entreprises satisfaites
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <div className="text-muted-foreground">
                Temps de réponse moyen
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-muted-foreground">
              Découvrez ce que nos clients disent de nous
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "PetitsBureaux nous a permis de trouver l'espace parfait pour
                  notre équipe. Le processus était simple et rapide."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">A</span>
                  </div>
                  <div>
                    <div className="font-semibold">Allday</div>
                    <div className="text-sm text-muted-foreground">
                      Startup Tech
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Service client exceptionnel et bureaux de qualité. Nous
                  recommandons vivement PetitsBureaux."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">C</span>
                  </div>
                  <div>
                    <div className="font-semibold">Cap4 Lab</div>
                    <div className="text-sm text-muted-foreground">
                      Laboratoire
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Flexibilité et transparence des prix. Parfait pour notre
                  équipe en croissance."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">I</span>
                  </div>
                  <div>
                    <div className="font-semibold">InnovTech</div>
                    <div className="text-sm text-muted-foreground">
                      Consulting
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à trouver votre espace de travail idéal ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez des centaines d'entreprises qui nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Voir tous les bureaux
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Phone className="h-4 w-4 mr-2" />
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PetitsBureaux</h3>
              <p className="text-muted-foreground text-sm">
                Votre partenaire pour trouver l'espace de travail parfait à
                Paris.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Bureaux privés</li>
                <li>Espace de coworking</li>
                <li>Bureaux opérés</li>
                <li>Solutions sur mesure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Centre d'aide</li>
                <li>Contact</li>
                <li>FAQ</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>01 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@petitsbureaux.fr</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PetitsBureaux. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
