import { Suspense } from "react";
import ArrondissementPageContent from "./_components/arrondissement-page-content";
import { SearchProvider } from "@/components/search/search-provider";
import { MapListSyncProvider } from "@/components/search/map-list-sync-provider";

interface ArrondissementPageProps {
  params: Promise<{ arrondissement: string }>;
}

function extractArrondissementNumber(
  arrondissementSlug: string
): number | null {
  const match = arrondissementSlug.match(/^bureaux-paris-(\d+)$/);
  if (!match) return null;

  const number = parseInt(match[1], 10);
  if (number < 1 || number > 20) return null;

  return number;
}

export async function generateStaticParams() {
  const arr = [...Array.from({ length: 20 }, (_, i) => i + 1)].map(
    (num) => `bureaux-paris-${num}`
  );

  return arr.map((arrondissement) => ({
    arrondissement,
  }));
}

export default async function ArrondissementPage({
  params,
}: ArrondissementPageProps) {
  const { arrondissement: arrondissementSlug } = await params;

  const arrondissementNumber = extractArrondissementNumber(arrondissementSlug);

  if (!arrondissementNumber) {
    throw new Error("Invalid arrondissement");
  }

  return (
    <SearchProvider>
      <MapListSyncProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <ArrondissementPageContent
            arrondissement={arrondissementNumber.toString()}
          />
        </Suspense>
      </MapListSyncProvider>
    </SearchProvider>
  );
}
