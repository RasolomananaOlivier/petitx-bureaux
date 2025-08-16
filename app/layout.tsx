import type { Metadata } from "next";
import "./globals.css";
import { GoogleMapProvider } from "@/providers/google-map-provider";
import { roslindaleBlack, robertSans } from "./font";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "PetitsBureaux - Bureaux indépendants à Paris",
    template: "%s | PetitsBureaux",
  },
  description:
    "Trouvez votre bureau indépendant à Paris. Des espaces de travail flexibles et personnalisés pour entrepreneurs et petites équipes.",
  keywords: [
    "bureau paris",
    "espace de travail",
    "bureau indépendant",
    "coworking",
    "location bureau",
  ],
  authors: [{ name: "PetitsBureaux" }],
  creator: "PetitsBureaux",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: defaultUrl,
    siteName: "PetitsBureaux",
    title: "PetitsBureaux - Bureaux indépendants à Paris",
    description:
      "Trouvez votre bureau indépendant à Paris. Des espaces de travail flexibles et personnalisés pour entrepreneurs et petites équipes.",
    images: [
      {
        url: `${defaultUrl}/hero.webp`,
        width: 1200,
        height: 630,
        alt: "PetitsBureaux - Bureaux indépendants à Paris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetitsBureaux - Bureaux indépendants à Paris",
    description:
      "Trouvez votre bureau indépendant à Paris. Des espaces de travail flexibles et personnalisés pour entrepreneurs et petites équipes.",
    images: [`${defaultUrl}/hero.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robertSans.className} ${roslindaleBlack.variable} antialiased `}
      >
        <QueryProvider>
          <GoogleMapProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}
          >
            {children}
            <Toaster />
          </GoogleMapProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
