import {
  Wifi,
  Coffee,
  Users,
  Printer,
  Tv,
  Utensils,
  Sparkles,
  Building2,
  FileText,
  Monitor,
} from "lucide-react";

interface OfficeServicesProps {
  services: string[];
}

const serviceIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Salle de réunion privée": Users,
  Wifi: Wifi,
  Fibre: Wifi,
  "Coin cafet": Coffee,
  "Espace détente": Utensils,
  Ménage: Sparkles,
  "Tables / chaises": Building2,
  Imprimante: Printer,
  Photocopieur: FileText,
  "Écran TV": Tv,
};

export function OfficeServices({ services }: OfficeServicesProps) {
  const displayedServices = services.slice(0, 6);
  const hasMoreServices = services.length > 6;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grid-rows-5">
        {displayedServices.map((service, index) => {
          const IconComponent = serviceIcons[service] || Monitor;
          return (
            <div key={index} className="flex items-center gap-3 p-1">
              <IconComponent className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{service}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
