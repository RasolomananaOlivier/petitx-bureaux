import { notFound } from "next/navigation";
import { OfficeGallery } from "./_components/office-gallery";
import { OfficeHeader } from "./_components/office-header";
import { OfficeDetails } from "./_components/office-details";
import { OfficeLocation } from "./_components/office-location";
import { OfficeContact } from "./_components/office-contact";
import { OfficeServices } from "./_components/office-services";
import { RelatedOffices } from "./_components/related-offices";
import { getOfficeBySlug } from "@/lib/api/offices";

interface OfficePageProps {
  params: Promise<{ slug: string }>;
}

export default async function OfficePage({ params }: OfficePageProps) {
  const { slug } = await params;

  const office = await getOfficeBySlug(slug);

  if (!office) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 sm:px-6 lg:px-8 pb-8 lg:py-8">
        <OfficeGallery images={office.photos.map((photo) => photo.url)} />
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 px-4 lg:px-0">
          <div className="grid-cols-1 lg:col-span-2 space-y-8">
            <OfficeHeader
              title={office.title}
              workstations={office.nbPosts || 0}
              surface={Math.round((office.nbPosts || 1) * 5)}
              price={Math.round(office.priceCents / 100)}
              currency="€"
              period="HT par mois"
              availability="Dispo immédiatement"
            />
            <div className="lg:hidden">
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
            <OfficeLocation
              address={`Paris ${office.arr}`}
              coordinates={{
                lat: office.lat,
                lng: office.lng,
              }}
            />
            <OfficeDetails
              description={office.description || "Description non disponible"}
            />
            <OfficeServices
              services={office.officeServices.map((os) => os.service.name)}
            />
          </div>

          <div className="hidden lg:block lg:col-span-1">
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

        <div className="lg:mt-16 space-y-12">
          <RelatedOffices />
        </div>
      </div>
    </div>
  );
}
