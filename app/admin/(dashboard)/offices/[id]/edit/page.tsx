// import { OfficeForm } from "@/components/admin/office-form";
import { Office } from "@/lib/types";

// Mock function to fetch office by ID
async function getOffice(id: string): Promise<Office> {
  // In real app, this would be an API call
  return {
    id,
    name: "Bureau Marais Cosy",
    description: "Un bureau chaleureux au cœur du Marais",
    address: "15 rue des Rosiers, 75004 Paris",
    arrondissement: 4,
    pricePerDay: 45,
    pricePerHour: 8,
    capacity: 4,
    amenities: ["WiFi", "Café", "Imprimante"],
    photos: ["/office1.jpg", "/office1-2.jpg"],
    isActive: true,
    isFake: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-01"),
    coordinates: { lat: 48.8566, lng: 2.3522 },
  };
}

export default async function EditOfficePage({
  params,
}: {
  params: { id: string };
}) {
  const office = await getOffice(params.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Éditer le Bureau</h1>
        <p className="text-gray-600">Modifier les informations du bureau</p>
      </div>

      {/* <OfficeForm office={office} mode="edit" /> */}
    </div>
  );
}
