import { notFound } from "next/navigation";
import { Metadata } from "next";
import LeadForm from "./_components/lead-form";
import { OfficeSummary } from "./_components/office-summary";
import { officesRepository } from "@/features/offices/repositories/offices.repo";
import { db } from "@/lib/db/drizzle";

import FormTitle from "./_components/form-title";

interface LeadPageProps {
  searchParams: Promise<{ officeId?: string }>;
}

export async function generateMetadata({
  searchParams,
}: LeadPageProps): Promise<Metadata> {
  const { officeId } = await searchParams;

  if (!officeId) {
    return {
      title: "Page non trouvée | PetitsBureaux",
      description: "La page que vous recherchez n'existe pas.",
    };
  }

  const office = await officesRepository.getOfficeById(
    db,
    parseInt(officeId, 10)
  );

  if (!office) {
    return {
      title: "Bureau non trouvé | PetitsBureaux",
      description:
        "Le bureau que vous recherchez n'existe pas ou a été supprimé.",
    };
  }

  const title = `Contacter pour ${office.title} | PetitsBureaux`;
  const description = `Contactez-nous pour plus d'informations sur ce bureau à ${office.arr}. Formulaire de contact rapide et sécurisé.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
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
      <FormTitle />

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
