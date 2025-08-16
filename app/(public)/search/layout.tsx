import { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Rechercher des bureaux | PetitsBureaux",
  description:
    "Recherchez des bureaux indépendants à Paris par arrondissement, budget, nombre de postes et services. Trouvez l'espace de travail idéal pour votre équipe.",
  openGraph: {
    title: "Rechercher des bureaux | PetitsBureaux",
    description:
      "Recherchez des bureaux indépendants à Paris par arrondissement, budget, nombre de postes et services.",
    url: `${defaultUrl}/search`,
    siteName: "PetitsBureaux",
    images: [
      {
        url: `${defaultUrl}/hero.webp`,
        width: 1200,
        height: 630,
        alt: "Recherche de bureaux - PetitsBureaux",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rechercher des bureaux | PetitsBureaux",
    description:
      "Recherchez des bureaux indépendants à Paris par arrondissement, budget, nombre de postes et services.",
    images: [`${defaultUrl}/hero.webp`],
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
