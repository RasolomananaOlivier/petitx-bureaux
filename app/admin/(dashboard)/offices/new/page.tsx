import { OfficeForm } from "@/components/admin/office-form";

export default function NewOfficePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Bureau</h1>
        <p className="text-gray-600">
          Créer un nouveau bureau sur la plateforme
        </p>
      </div>

      <OfficeForm mode="create" />
    </div>
  );
}
