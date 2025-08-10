import type { Metadata } from "next";
import "./globals.css";
import { GoogleMapProvider } from "@/providers/google-map-provider";
import Navbar from "@/components/navbar";
import { roslindaleBlack, robertSans } from "./font";

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
  console.log(roslindaleBlack.variable);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robertSans.className} ${roslindaleBlack.variable} antialiased `}
      >
        <GoogleMapProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
          {/* Navigation */}
          <Navbar />
          {/* Main content */}
          {children}
        </GoogleMapProvider>
      </body>
    </html>
  );
}
