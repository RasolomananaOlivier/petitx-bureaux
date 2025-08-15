import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

export interface CSVRow {
  title: string;
  description: string;
  slug: string;
  arr: string;
  priceCents: string;
  nbPosts: string;
  lat: string;
  lng: string;
  isFake: string;
  amenities: string;
}

export function generateCSVTemplate(): string {
  const templateData: CSVRow[] = [
    {
      title: "Bureau moderne - Champs-Élysées",
      description:
        "Bureau moderne avec vue sur les Champs-Élysées, idéal pour les entreprises",
      slug: "bureau-champs-elysees",
      arr: "8",
      priceCents: "150000",
      nbPosts: "5",
      lat: "48.8698",
      lng: "2.3077",
      isFake: "false",
      amenities: "WiFi;Salle de réunion;Imprimante;Climatisation",
    },
    {
      title: "Espace coworking - Le Marais",
      description: "Espace de coworking dynamique dans le quartier du Marais",
      slug: "coworking-marais",
      arr: "3",
      priceCents: "120000",
      nbPosts: "8",
      lat: "48.8606",
      lng: "2.3376",
      isFake: "false",
      amenities: "WiFi;Parking;Café;Espace détente",
    },
    {
      title: "Bureau privatif - Saint-Germain",
      description: "Bureau privatif dans un immeuble historique",
      slug: "bureau-saint-germain",
      arr: "6",
      priceCents: "200000",
      nbPosts: "3",
      lat: "48.8534",
      lng: "2.3488",
      isFake: "false",
      amenities: "WiFi;Sécurité 24/7;Réception;Terrasse",
    },
  ];

  return stringify(templateData, {
    header: true,
    quoted: true,
    quoted_empty: true,
  });
}

export function parseCSV(csvText: string): CSVRow[] {
  try {
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records as CSVRow[];
  } catch (error) {
    throw new Error(
      `Invalid CSV format: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function validateCSVHeaders(headers: string[]): string[] {
  const requiredHeaders = [
    "title",
    "description",
    "slug",
    "arr",
    "priceCents",
    "nbPosts",
    "lat",
    "lng",
    "isFake",
    "amenities",
  ];

  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );

  return missingHeaders;
}
