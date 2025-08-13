import { Check } from "lucide-react";

interface OfficeDetailsProps {
  description: string;
}

export function OfficeDetails({ description }: OfficeDetailsProps) {
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
    </div>
  );
}
