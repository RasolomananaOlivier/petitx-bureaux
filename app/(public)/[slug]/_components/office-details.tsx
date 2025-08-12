import { Check } from "lucide-react";

interface OfficeDetailsProps {
  description: string;
  features: string[];
  floor: string;
  surfacePerWorkstation: string;
}

export function OfficeDetails({
  description,
  features,
  floor,
  surfacePerWorkstation,
}: OfficeDetailsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          À propos de ce bureau
        </h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
          Voir plus
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          À propos de l'espace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Étage</span>
              <span className="font-medium text-gray-900">{floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Surface par poste</span>
              <span className="font-medium text-gray-900">
                {surfacePerWorkstation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
