import type { Metadata } from "next";
import { GoogleMapProvider } from "@/providers/google-map-provider";
import Navbar from "@/components/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Navigation */}
      <Navbar />
      {/* Main content */}
      {children}
    </div>
  );
}
