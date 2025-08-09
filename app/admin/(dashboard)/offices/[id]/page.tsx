import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Users, Euro, Calendar } from "lucide-react";
import { Office } from "@/lib/types";

async function getOffice(id: string): Promise<Office> {
  // Mock data - replace with actual API call
  return {
    id,
    name: "Bureau Marais Cosy",
    description:
      "Un bureau chaleureux au cœur du Marais avec tout l'équipement nécessaire pour travailler dans de bonnes conditions.",
    address: "15 rue des Rosiers, 75004 Paris",
    arrondissement: 4,
    pricePerDay: 45,
    pricePerHour: 8,
    capacity: 4,
    amenities: [
      "WiFi haut débit",
      "Café/Thé",
      "Imprimante/Scanner",
      "Climatisation",
      "Tableau blanc",
    ],
    photos: ["/office1.jpg", "/office1-2.jpg", "/office1-3.jpg"],
    isActive: true,
    isFake: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-01"),
    coordinates: { lat: 48.8566, lng: 2.3522 },
  };
}

export default async function OfficeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const office = await getOffice(params.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{office.name}</h1>
          <p className="text-gray-600 flex items-center mt-2">
            <MapPin className="w-4 h-4 mr-1" />
            {office.address}
          </p>
        </div>
        <Link href={`/admin/offices/${office.id}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Éditer
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Euro className="w-5 h-5 mr-2" />
              Tarification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prix par jour:</span>
                <span className="font-semibold">{office.pricePerDay}€</span>
              </div>
              <div className="flex justify-between">
                <span>Prix par heure:</span>
                <span className="font-semibold">{office.pricePerHour}€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Capacité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{office.capacity}</div>
            <p className="text-sm text-muted-foreground">personnes maximum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={office.isActive ? "default" : "secondary"}>
                {office.isActive ? "Actif" : "Inactif"}
              </Badge>
              <br />
              <Badge variant={office.isFake ? "destructive" : "outline"}>
                {office.isFake ? "Bureau factice" : "Bureau réel"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{office.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {office.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {office.photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500">Photo {index + 1}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
