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
import {
  getOfficeBySlug,
  getSuggestedOffices,
  type Office,
} from "@/lib/api/offices";

interface OfficePageProps {
  params: Promise<{ slug: string }>;
}

export default async function OfficePage({ params }: OfficePageProps) {
  const { slug } = await params;

  try {
    const [office, suggestedOffices] = await Promise.all([
      getOfficeBySlug(slug),
      getSuggestedOffices(slug),
    ]);

    if (!office) {
      notFound();
    }

    const relatedOfficesData = suggestedOffices.map((office) => ({
      id: office.id.toString(),
      slug: office.slug,
      title: office.title,
      address: `Paris ${office.arr}`,
      workstations: office.nbPosts || 0,
      surface: Math.round((office.nbPosts || 1) * 5),
      price: Math.round(office.priceCents / 100),
      image: office.photos[0]?.url || "/open_space.webp",
      available: true,
    }));

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs office={office} />
          <OfficeGallery images={office.photos.map((photo) => photo.url)} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <OfficeHeader
                title={office.title}
                workstations={office.nbPosts || 0}
                surface={Math.round((office.nbPosts || 1) * 5)}
                price={Math.round(office.priceCents / 100)}
                currency="€"
                period="HT par mois"
                availability="Dispo immédiatement"
              />
              <OfficeLocation
                address={`Paris ${office.arr}`}
                metroStations={[
                  { name: "Métro", time: 3 },
                  { name: "RER", time: 7 },
                ]}
                coordinates={{
                  lat: office.lat,
                  lng: office.lng,
                }}
              />
              <OfficeDetails
                description={office.description || "Description non disponible"}
                features={["Accès 24/7", "Accès par badge", "Ascenseur"]}
                floor="2ème étage"
                surfacePerWorkstation="5 m²"
              />
              <OfficeServices
                services={office.officeServices.map((os) => os.service.name)}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <OfficeContact
                  contact={{
                    name: "Paul",
                    avatar: "/avatar1.webp",
                    partnerSince: 2025,
                    responseTime: "quelques jours",
                    responseRate: 50,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-12">
            <RelatedOffices offices={relatedOfficesData} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching office data:", error);
    notFound();
  }
}
