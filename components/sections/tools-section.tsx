import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ToolCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  textButton: string;
};
function ToolCard({ title, description, imageSrc, textButton }: ToolCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col h-full min-w-[300px]">
      <Image src={imageSrc} alt={title} width={400} height={144} />

      <CardHeader className="pb-2 group-hover:bg-gray-50 transition-colors px-4">
        <CardTitle className="font-bold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 group-hover:bg-gray-50 transition-colors px-4 flex-1">
        <p className="text-gray-900">{description}</p>
      </CardContent>

      <div className="mt-auto flex justify-end px-4 pb-2 group-hover:bg-gray-50">
        <Button variant="ghost" className="underline hover:bg-transparent p-0">
          {textButton} <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}

type Props = Record<string, never>;

const tools = [
  {
    title: "Emplacement de bureau idéal",
    description:
      "Trouvez où installer votre équipe en fonction des adresses de vos collaborateurs.",
    imageSrc: "/ideal_location_x204.webp",
    textButton: "Rechercher",
  },
  {
    title: "Comparateur de contrats",
    description:
      "Estimez exactement vos coûts et charges selon le type de contrat de location choisi.",
    imageSrc: "/contract_comparator_x204.webp",
    textButton: "Comparer",
  },
  {
    title: "Calculateur de surface",
    description:
      "Calculez la surface idéale de bureau pour votre équipe selon votre organisation du télétravail.",
    imageSrc: "/space_calculator_x204.webp",
    textButton: "Comparer",
  },
];

export default function ToolsSection({}: Props) {
  return (
    // Main container with light blue-gray background
    <div className="pt-12 pb-14">
      <div className=" max-w-7xl mx-auto gap-6 md:gap-10 flex flex-col ">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-0 font-roslindale px-4 md:px-10">
          Nos outils intelligents au service de votre recherche
        </h2>

        <div className=" w-full flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-hide px-4 md:px-10">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              imageSrc={tool.imageSrc}
              textButton={tool.textButton}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
