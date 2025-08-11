import { create } from "zustand";
import * as z from "zod";
import { NewOffice } from "../db/schema";

// Types
type UploadFile = {
  file: File;
  id: string;
};

export type Office = NewOffice & {
  amenities: string[];
  photos: UploadFile[];
};

export type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  schema: z.ZodSchema<any>;
};

export type OfficeFormState = {
  formData: Office;
  currentStep: number;
  completedSteps: Set<number>;
  updateFormData: (data: Partial<Office>) => void;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  resetForm: () => void;
};

export const initialFormData: Office = {
  title: "",
  description: "",
  arr: 1,
  priceCents: 0,
  nbPosts: 1,
  isFake: false,
  lat: 0,
  lng: 0,
  slug: "",
  amenities: [],
  photos: [],
};

// Zustand store
export const useOfficeFormStore = create<OfficeFormState>((set) => ({
  formData: initialFormData,
  currentStep: 0,
  completedSteps: new Set<number>(),

  updateFormData: (data: Partial<Office>) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setCurrentStep: (step: number) => set({ currentStep: step }),

  markStepCompleted: (step: number) =>
    set((state) => ({
      completedSteps: new Set([...state.completedSteps, step]),
    })),

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 0,
      completedSteps: new Set<number>(),
    }),
}));
