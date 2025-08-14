import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Office } from "@/lib/db/schema";

interface OfficeSummaryProps {
  office: Office & {
    photos: Array<{
      id: number;
      url: string;
      alt: string | null;
    }>;
    officeServices: Array<{
      service: {
        id: number;
        name: string;
        icon: string | null;
      };
    }>;
  };
}

export function OfficeSummary({ office }: OfficeSummaryProps) {
  const priceInEuros = office.priceCents / 100;
  const mainPhoto = office.photos[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex gap-4">
          <div className="bg-gray-200 size-20 rounded-lg overflow-hidden flex-shrink-0">
            {mainPhoto && (
              <img
                src={mainPhoto.url}
                alt={mainPhoto.alt || office.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm leading-tight">{office.title}</h3>
            <div className="text-sm text-gray-600 mt-1">
              {office.nbPosts} postes • {office.arr}e arrondissement
            </div>
            <div className="text-sm font-semibold mt-1">
              {formatCurrency(priceInEuros)} HT par mois
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="text-sm text-gray-700">
          Proposé le {formatDate(office.createdAt)}
        </div>
      </div>

      <div className="p-4 border rounded-lg space-y-1">
        <h3 className="font-bold text-lg font-roslindale">Petits Bureaux</h3>
        <p className="text-sm text-gray-700">
          Contactez une annonce sur Petits Bureaux et profitez de notre
          accompagnement gratuit pour votre recherche.
        </p>
      </div>
    </div>
  );
}
