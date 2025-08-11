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
