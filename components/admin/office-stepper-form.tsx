"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import Step1 from "./office-form/step1";
import Step2 from "./office-form/step2";
import {
  initialFormData,
  Office,
  useOfficeFormStore,
} from "@/lib/store/office-store";
import Step3 from "./office-form/step3";
import { steps } from "./office-form/data";
import Step4 from "./office-form/step4";
import { Stepper } from "./office-form/stepper";
import { api } from "@/lib/api/axios";
import { syncPhotos } from "@/lib/api/photo-sync";
import { Office as DBOffice } from "@/lib/db/schema";
import { toast } from "sonner";
import { useUpdateAdminOffice } from "@/hooks/use-admin-offices";
import { supabaseStorage } from "@/lib/supabase/storage";
import { photosApi } from "@/lib/api/photos";
import { useRouter } from "next/navigation";

interface OfficeStepperFormProps {
  mode?: "create" | "edit";
  officeId?: number;
}

export default function OfficeStepperForm({
  mode = "create",
  officeId,
}: OfficeStepperFormProps) {
  const {
    formData,
    currentStep,
    completedSteps,
    updateFormData,
    setCurrentStep,
    markStepCompleted,
    resetForm,
  } = useOfficeFormStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateOfficeMutation = useUpdateAdminOffice();
  const router = useRouter();

  const form = useForm<Office>({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: formData,
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit" && formData !== initialFormData) {
      form.reset(formData);
    }
  }, [formData, form, mode]);

  useEffect(() => {
    form.reset(formData);
  }, [currentStep, form, formData]);

  const nextStep = async (): Promise<void> => {
    const isValid = await form.trigger();
    if (isValid) {
      const currentData = form.getValues();
      updateFormData(currentData);
      markStepCompleted(currentStep);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          form.reset({ ...formData, ...currentData });
        }, 0);
      }
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      const currentData = form.getValues();

      updateFormData(currentData);
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        form.reset({ ...formData, ...currentData });
      }, 0);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const isValid = await form.trigger();

    if (isValid) {
      setIsLoading(true);
      const finalData: Office = { ...formData, ...form.getValues() };

      try {
        if (mode === "edit" && officeId) {
          await handleUpdateOffice(finalData, officeId);

          toast.success("Bureau modifié avec succès !");
          router.push(`/admin/offices/`);
        } else {
          await handleCreateOffice(finalData);

          resetForm();
          form.reset({
            ...initialFormData,
          });

          toast.success("Bureau créé avec succès !");
        }
      } catch (error) {
        console.error("Error saving office:", error);
        toast.error(
          mode === "edit"
            ? "Erreur lors de la modification du bureau"
            : "Erreur lors de la création du bureau"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateOffice = async (finalData: Office) => {
    const res = await api.post<DBOffice>("/api/admin/offices", finalData);

    if (finalData.photos.length > 0) {
      const imageUrls = await supabaseStorage.uploadFiles(
        finalData.photos.map((f) => f.file),
        res.data.id
      );

      if (imageUrls.length > 0) {
        await photosApi.addPhotos(imageUrls, res.data.id);
      }
    }
  };

  const handleUpdateOffice = async (finalData: Office, officeId: number) => {
    await updateOfficeMutation.mutateAsync({
      id: officeId,
      data: finalData,
    });

    if (finalData.photos.length > 0 || finalData.removedPhotos.length > 0) {
      await syncPhotos({
        newPhotos: finalData.photos.map((f) => f.file),
        removedPhotoIds: finalData.removedPhotos,
        existingPhotos: finalData.existingPhotos,
        officeId,
      });
    }
  };

  const renderCurrentStep = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <Step1 form={form} />;
      case 1:
        return <Step2 form={form} />;
      case 2:
        return <Step3 form={form} />;
      case 3:
        return <Step4 form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <Stepper currentStep={currentStep} completedSteps={completedSteps} />

      <div className="">
        <div className="mb-8">{renderCurrentStep()}</div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || updateOfficeMutation.isPending}
                className="flex items-center gap-2"
              >
                {(isLoading || updateOfficeMutation.isPending) && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {isLoading || updateOfficeMutation.isPending
                  ? mode === "edit"
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : mode === "edit"
                  ? "Modifier le bureau"
                  : "Créer le bureau"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
