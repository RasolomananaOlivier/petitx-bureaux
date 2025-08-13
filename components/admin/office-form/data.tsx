import { Step } from "@/lib/store/office-store";
import * as z from "zod";
import { Building2, Euro, Settings, Camera } from "lucide-react";

// Zod validation schemas for each step
const step1Schema = z.object({
  title: z.string().min(1, "Le nom du bureau est requis"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  slug: z
    .string()
    .min(1, "Le lien personnalisé est requis")
    .regex(
      /^[a-z0-9-]+$/,
      "Le lien doit contenir uniquement des lettres minuscules, des chiffres et des tirets"
    ),
  lat: z.number().min(-90).max(90, "Latitude invalide"),
  lng: z.number().min(-180).max(180, "Longitude invalide"),
  arr: z
    .number()
    .min(1, "L'arrondissement est requis")
    .max(20, "L'arrondissement doit être entre 1 et 20"),
});

const step2Schema = z.object({
  priceCents: z
    .number({
      required_error: "Le prix est requis",
      invalid_type_error: "Le prix doit être un nombre",
    })
    .int("Le prix doit être un nombre entier")
    .min(1000, "Le prix doit être d'au moins 10 € (1000 centimes)"),
  nbPosts: z
    .number({
      required_error: "La capacité est requise",
      invalid_type_error: "La capacité doit être un nombre",
    })
    .int("La capacité doit être un nombre entier")
    .min(1, "La capacité doit être d'au moins 1 poste"),
  isFake: z.boolean(),
});

const step3Schema = z.object({
  amenities: z.array(z.string()).min(1, "Ajoutez au moins un équipement"),
});

const step4Schema = z.object({
  photos: z
    .array(
      z.object({
        file: z.instanceof(File),
        id: z.string(),
      })
    )
    .min(4, "Au moins 4 photos sont requises"),
});

export const steps: Step[] = [
  {
    id: 0,
    title: "Informations générales",
    description: "Détails de base du bureau",
    icon: Building2,
    schema: step1Schema,
  },
  {
    id: 1,
    title: "Prix et capacité",
    description: "Tarification et paramètres",
    icon: Euro,
    schema: step2Schema,
  },
  {
    id: 2,
    title: "Équipements",
    description: "Services disponibles",
    icon: Settings,
    schema: step3Schema,
  },
  {
    id: 3,
    title: "Photos",
    description: "Images du bureau",
    icon: Camera,
    schema: step4Schema,
  },
];
