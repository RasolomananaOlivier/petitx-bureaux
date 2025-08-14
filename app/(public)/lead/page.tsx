import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import LeadForm from "./_components/lead-form";
import { OfficeSummary } from "./_components/office-summary";
import { officesRepository } from "@/features/offices/repositories/offices.repo";
import { db } from "@/lib/db/drizzle";

interface LeadPageProps {
  searchParams: Promise<{ officeId?: string }>;
}

export default async function LeadPage({ searchParams }: LeadPageProps) {
  const { officeId } = await searchParams;

  if (!officeId) {
    notFound();
  }

  const office = await officesRepository.getOfficeById(
    db,
    parseInt(officeId, 10)
  );

  if (!office) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 lg:px-10">
      <h2 className="text-2xl font-semibold mb-6 lg:mb-8">
        Contactez-nous pour une visite
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1">
          <LeadForm officeId={parseInt(officeId, 10)} />
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <OfficeSummary office={office} />
        </div>
      </div>
    </main>
  );
}
