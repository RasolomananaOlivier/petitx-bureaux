"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminOffice } from "@/hooks/use-admin-offices";
import { useOfficeFormStore } from "@/lib/store/office-store";
import OfficeStepperForm from "@/components/admin/office-stepper-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditOfficePage() {
  const params = useParams();
  const router = useRouter();
  const officeId = Number(params.id);

  const { data: office, isLoading, error } = useAdminOffice(officeId);
  const { updateFormData, resetForm } = useOfficeFormStore();

  useEffect(() => {
    if (office) {
      const formData = {
        title: office.title,
        description: office.description || "",
        arr: office.arr,
        priceCents: office.priceCents,
        nbPosts: office.nbPosts || 1,
        isFake: office.isFake,
        slug: office.slug,
        lat: office.lat,
        lng: office.lng,
        amenities: office.officeServices.map((service) => service.service.name),
        photos: [],
        existingPhotos: (office.photos || []).map((photo) => ({
          id: photo.id,
          url: photo.url,
          alt: photo.alt || "",
        })),
        removedPhotos: [],
      };

      updateFormData(formData);
    }
  }, [office, updateFormData]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Modifier le bureau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2
                className="h-8 w-8 animate-spin"
                data-testid="loading-spinner"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Une erreur est survenue"}
              </p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Bureau non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="mb-4">Le bureau demandé n'existe pas.</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Modifier le bureau</h1>
        <p className="text-muted-foreground">
          Modifiez les informations du bureau "{office.title}"
        </p>
      </div>

      <OfficeStepperForm mode="edit" officeId={officeId} />
    </div>
  );
}
