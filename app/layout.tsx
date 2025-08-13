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
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
