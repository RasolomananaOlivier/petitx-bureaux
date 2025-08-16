import { notFound } from "next/navigation";
import { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: OfficePageProps): Promise<Metadata> {
  const { slug } = await params;
  const office = await getOfficeBySlug(slug);

  if (!office) {
    return {
      title: "Bureau non trouvé | Petits Bureaux",
      description:
        "Le bureau que vous recherchez n'existe pas ou a été supprimé.",
    };
  }

  const title = `${office.title} - ${office.arr} | PetitsBureaux`;
  const description = office.description
    ? `${office.description.substring(0, 160)}...`
    : `Bureau disponible à ${office.arr}, ${
        office.nbPosts || 0
      } postes de travail, ${Math.round(office.priceCents / 100)}€ HT/mois.`;

  const imageUrl =
    office.photos.length > 0
      ? office.photos[0].url
      : `${process.env.VERCEL_URL || "http://localhost:3000"}/hero.webp`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.VERCEL_URL || "http://localhost:3000"}/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: office.title,
        },
      ],
      siteName: "PetitsBureaux",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
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
                officeId={office.id}
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
                officeId={office.id}
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
