import { notFound } from "next/navigation";
import { OfficeGallery } from "./_components/office-gallery";
import { OfficeHeader } from "./_components/office-header";
import { OfficeDetails } from "./_components/office-details";
import { OfficeLocation } from "./_components/office-location";
import { OfficeContact } from "./_components/office-contact";
import { OfficeServices } from "./_components/office-services";
import { OfficeContract } from "./_components/office-contract";
import { RelatedOffices } from "./_components/related-offices";
import { Breadcrumbs } from "./_components/breadcrumbs";
import { PromotionalBanner } from "./_components/promotional-banner";
import { ExploreSection } from "./_components/explore-section";

const mockOfficeData = {
  id: "1",
  slug: "bureau-prive-sous-location-rue-vivienne",
  title: "Bureau privé - sous-location",
  workstations: 18,
  surface: 100,
  price: 8500,
  currency: "€",
  period: "HT par mois",
  availability: "Dispo immédiatement",
  address: "Rue Vivienne, Paris 2",
  description:
    "Premium workspace in the heart of the 2nd arrondissement, Rue Vivienne, a stone's throw from the Bourse and Palais-Royal. This space is in a character building, shared with an advertising agency, offering an inspiring, bright, and convivial environment ideal for creative or growing businesses.",
  images: [
    "/open_space.webp",
    "/private.webp",
    "/independent.webp",
    "/building.webp",
    "/hero.webp",
  ],
  metroStations: [
    { name: "Bourse", time: 3 },
    { name: "Quatre Septembre", time: 7 },
    { name: "Grands Boulevards", time: 7 },
    { name: "Sentier", time: 9 },
    { name: "Richelieu-Drouot", time: 9 },
  ],
  features: ["Accès 24/7", "Accès par badge", "Ascenseur"],
  floor: "2ème étage",
  surfacePerWorkstation: "5 m²",
  contract: {
    type: "Prestation de service",
    minCommitment: "12 mois",
    noticePeriod: "3 mois",
    securityDeposit: "3 mois",
    entryFees: "0€",
    ubiqFees: "0€",
  },
  services: [
    "Salle de réunion privée",
    "Wifi",
    "Fibre",
    "Coin cafet",
    "Espace détente",
    "Ménage",
    "Tables / chaises",
    "Imprimante",
    "Photocopieur",
    "Écran TV",
  ],
  contact: {
    name: "Paul",
    avatar: "/avatar1.webp",
    partnerSince: 2025,
    responseTime: "quelques jours",
    responseRate: 50,
  },
  coordinates: {
    lat: 48.8663,
    lng: 2.3417,
  },
};

const mockRelatedOffices = [
  {
    id: "2",
    title: "Bureau privé - coworking",
    address: "Rue du Caire, Paris 2",
    workstations: 25,
    surface: 94,
    price: 10900,
    image: "/open_space.webp",
    available: true,
  },
  {
    id: "3",
    title: "Bureau privé - coworking",
    address: "Rue Montmartre, Paris 2",
    workstations: 18,
    surface: 100,
    price: 10800,
    image: "/private.webp",
    available: true,
  },
  {
    id: "4",
    title: "Bureau privé - coworking",
    address: "Rue du Caire, Paris 2",
    workstations: 25,
    surface: 87,
    price: 9900,
    image: "/independent.webp",
    available: true,
  },
];

interface OfficePageProps {
  params: Promise<{ slug: string }>;
}

export default async function OfficePage({ params }: OfficePageProps) {
  const { slug } = await params;

  if (slug !== mockOfficeData.slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8 py-8">
        <OfficeGallery images={mockOfficeData.images} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OfficeHeader
              title={mockOfficeData.title}
              workstations={mockOfficeData.workstations}
              surface={mockOfficeData.surface}
              price={mockOfficeData.price}
              currency={mockOfficeData.currency}
              period={mockOfficeData.period}
              availability={mockOfficeData.availability}
            />
            <OfficeLocation
              address={mockOfficeData.address}
              metroStations={mockOfficeData.metroStations}
              coordinates={mockOfficeData.coordinates}
            />
            <OfficeDetails
              description={mockOfficeData.description}
              features={mockOfficeData.features}
              floor={mockOfficeData.floor}
              surfacePerWorkstation={mockOfficeData.surfacePerWorkstation}
            />
            <OfficeServices services={mockOfficeData.services} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <OfficeContact contact={mockOfficeData.contact} />
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <RelatedOffices offices={mockRelatedOffices} />
        </div>
      </div>
    </div>
  );
}
