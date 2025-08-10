"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { uploadFiles } from "@/lib/api/upload-files";
import { Office as DBOffice } from "@/lib/db/schema";

// Main OfficeStepperForm component
export default function OfficeStepperForm() {
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

  const form = useForm<any>({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: formData,
    mode: "onChange",
  });

  const nextStep = async (): Promise<void> => {
    const isValid = await form.trigger();
    if (isValid) {
      const currentData = form.getValues();
      updateFormData(currentData);
      markStepCompleted(currentStep);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        // Reset form with new schema and updated data
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
      // Reset form with previous step schema
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
        const res = await api.post<DBOffice>("/api/admin/offices", finalData);

        if (finalData.photos.length > 0) {
          const imageUrls = await uploadFiles(
            finalData.photos.map((f) => f.file),
            res.data.id
          );

          // Add photos to office
          if (imageUrls.length > 0) {
            await api.post("/api/admin/offices/photos", {
              photos: imageUrls.map((item) => ({
                url: item,
                alt: finalData.title,
              })),
              officeId: res.data.id,
            });
          }
        }

        resetForm();
        form.reset({
          ...initialFormData,
        });

        // alert("Bureau créé avec succès !");
      } catch (error) {
        console.error("Error creating office:", error);
        alert("Erreur lors de la création du bureau");
      } finally {
        setIsLoading(false);
      }
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
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                {isLoading ? "Création en cours..." : "Créer le bureau"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
