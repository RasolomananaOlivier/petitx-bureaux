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
  Check,
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

export default function HeroSection() {
  return (
    <section className="relative bg-gray-[#f1f5fd] md:bg-transparent md:my-2 max-h-full lg:min-w-[1330] 2xl:min-w-[1700px] md:mx-auto md:max-h-[580px]">
      {/* Background Image */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl mx-4"
        style={{
          backgroundImage: "url('/hero.webp')",
        }}
      />

      {/* White Content Box */}
      <div className="relative md:px-4 lg:max-w-6xl 2xl:max-w-7xl md:mx-auto md:py-4 lg:py-12">
        <div className="max-w-[500px]">
          <div className="bg-gray-50 rounded-xl px-4 py-8 md:p-9 md:shadow-2xl">
            <h1 className="text-5xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-6 max-w-xs">
              Faisons équipe pour trouver vos{" "}
              <span className="text-primary">bureaux</span>
            </h1>

            {/* Key Benefits */}
            <div className="space-y-3 mb-6 text-sm px-3">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-gray-950 flex-shrink-0" />
                <span className="text-gray-950">
                  Un expert dédié à vos côtés
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-gray-950 flex-shrink-0" />
                <span className="text-gray-950">
                  100% des bureaux, 100% à jour
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-gray-950 flex-shrink-0" />
                <span className="text-gray-950">Service gratuit</span>
              </div>
            </div>

            <div>
              {/* Trust Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Excellent 4.9 sur 5 Trustpilot
                  </span>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="py-6 text-base px-4">
                  <Link href="/search">
                    <Search className="!size-6 mr-2" />
                    Voir 8 286 annonces
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="py-6 text-base border-gray-300 text-gray-700 hover:bg-gray-50 px-4"
                >
                  Confier ma recherche
                </Button>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="md:hidden mt-6">
              <Button className="bg-white text-black rounded-full shadow-lg py-5">
                <div className="flex items-center justify-center  text-green-500 rounded-full size-6">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                WhatsApp
              </Button>
            </div>

            <div
              className="md:hidden bg-cover bg-[position:80%_50%] bg-no-repeat rounded-3xl h-[347px] w-full mt-6"
              style={{
                backgroundImage: "url('/hero.webp')",
              }}
            />
          </div>

          {/* WhatsApp Button */}
          <div className="hidden md:block mt-6">
            <Button className="bg-white text-black rounded-full shadow-lg py-5">
              <div className="flex items-center justify-center  text-green-500 rounded-full size-6">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
