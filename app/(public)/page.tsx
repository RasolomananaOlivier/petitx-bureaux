import { Metadata } from "next";
import HeroSection from "@/components/sections/hero-section";
import PartnersInfiniteScroll from "@/components/sections/partners-infinite-scroll";
import OfficeCategoriesSection from "@/components/sections/office-categories-section";
import PartenersSection from "@/components/sections/parteners-section";
import TestimonialsCarouselSection from "@/components/sections/testimonials-carousel-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import ProfSection from "@/components/sections/prof-section";
import ToolsSection from "@/components/sections/tools-section";
import LawSection from "@/components/sections/law-section";
import FaqSection from "@/components/sections/faq-section";
import LaunchSearchSection from "@/components/sections/lauch-search-section";
import LocationsSection from "@/components/sections/locations-section";
import LatestofficesSection from "@/components/sections/latest-office-section";
import Footer from "@/components/sections/footer-section";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Petits Bureaux - Bureaux indépendants à Paris",
  description:
    "Trouvez votre bureau indépendant à Paris. Des espaces de travail flexibles et personnalisés pour entrepreneurs et petites équipes. Recherche par arrondissement, budget et services.",
  openGraph: {
    title: "Petits Bureaux - Bureaux indépendants à Paris",
    description:
      "Trouvez votre bureau indépendant à Paris. Des espaces de travail flexibles et personnalisés pour entrepreneurs et petites équipes.",
    url: defaultUrl,
    siteName: "PetitsBureaux",
    images: [
      {
        url: `${defaultUrl}/hero.webp`,
        width: 1200,
        height: 630,
        alt: "PetitsBureaux - Bureaux indépendants à Paris",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Petits Bureaux - Bureaux indépendants à Paris",
    description:
      "Trouvez votre bureau indépendant à Paris. Des espaces de travail flexibles et personnalisés pour entrepreneurs et petites équipes.",
    images: [`${defaultUrl}/hero.webp`],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <PartnersInfiniteScroll />
      <OfficeCategoriesSection />
      <PartenersSection />
      <TestimonialsCarouselSection />
      <HowItWorksSection />

      <ProfSection />
      <ToolsSection />
      <LawSection />
      <FaqSection />
      <LaunchSearchSection />
      <LocationsSection />
      <LatestofficesSection />
      <Footer />
    </main>
  );
}
