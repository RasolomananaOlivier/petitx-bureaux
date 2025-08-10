"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

type Props = {};

export default function FaqSection({}: Props) {
  return (
    <section className="pt-16 pb-12">
      <div className="max-w-7xl mx-auto gap-10 flex flex-col px-10">
        <h2 className="text-4xl font-bold text-black mb-4 md:mb-0 font-roslindale">
          La FAQ de Petits Bureaux et de l'immobilier d'entreprise
        </h2>

        <div>
          <FAQList />
        </div>
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            size="lg"
            className="py-7 text-base border-primary text-primary hover:bg-transparent hover:text-primary px-6 font-bold"
          >
            Voir toute le FAQ
          </Button>
        </div>
      </div>
    </section>
  );
}

function FAQList() {
  const faqs: FAQProps[] = [
    {
      question: "Trouver mes bureaux avec Ubiq : comment ça marche ?",
      answer: (
        <>
          Vous choisissez comment lancer votre recherche : contactez directement
          des annonces ou envoyez-nous vos critères. Dans les 2 cas, nos experts
          vous rappellent pour faire le point, vous envoient des recommandations
          puis vous accompagnent sur le terrain en visite.
          <br />
          <br />
          Grâce à notre messagerie instantanée vous êtes aussi en contact direct
          avec les gestionnaires des bureaux !
        </>
      ),
    },
    {
      question: "Combien ça coûte ?",
      answer: (
        <>
          Votre recherche de bureau est <strong>sans honoraires</strong> ! Nous
          nous rémunérons selon un modèle d'apport d'affaires au succès et
          auprès de nos partenaires qui commercialisent des bureaux.
        </>
      ),
    },
    {
      question: "Pourquoi faire équipe avec Ubiq pour trouver mes bureaux ?",
      answer: (
        <>
          Ubiq est l'unique combinaison du numérique et du conseil : en
          cherchant des bureaux avec Ubiq, vous vous appuyez sur le seul site où
          l'offre de bureaux est mise à jour en temps réel et sur des
          fonctionnalités poussées pensées pour centraliser votre recherche.
          Vous faites aussi équipe avec nos experts qui vous éclairent sur le
          marché.
        </>
      ),
    },
    {
      question:
        "Quels types de bureaux vais-je trouver sur Ubiq ? Et à quelles conditions contractuelles ?",
      answer: (
        <>
          Tous les bureaux sont sur Ubiq : nos offres vont de l'Open Space à
          l'espace totalement indépendant en passant par le bureau privé tout
          équipé. Ces bureaux sont proposés par des espaces de coworking ou des
          entreprises classiques (marché qu'on appelle communément "sous loc",
          ne pas confondre avec le contrat de sous-location).
          <br />
          <br />
          Dans la plupart des cas, Ubiq préconise les bureaux commercialisés en
          contrat de prestation de service car il est plus flexible que le bail
          3/6/9. Nos experts vous accompagnent aussi sur les autres modalités
          contractuelles : prix, préavis, engagement.
        </>
      ),
    },
    {
      question: "Qu'est ce qu'un \"bureau opéré\" ?",
      answer: (
        <>
          Le "bureau opéré" est un terme lancé par Ubiq à l'occasion de sa
          première édition de l'Ubiqdata en 2021 et adopté par l'ensemble du
          marché. Un bureau opéré est un espace de travail indépendant dédié à
          une unique entreprise dès l'accueil, incluant de nombreux services et
          commercialisé via un contrat de prestation de service flexible.
          <br />
          <br />
          <a href="#" className="underline hover:no-underline">
            En savoir plus avec notre guide complet sur le bureau opéré.
          </a>
        </>
      ),
    },
    {
      question: "Quelle est la place de Ubiq dans l'immobilier d'entreprise ?",
      answer: (
        <>
          Ubiq participe depuis 10 ans à l'évolution de l'immobilier
          d'entreprise en promouvant les solutions émergentes les plus
          intéressantes pour vous comme le contrat de prestation de service, le
          coworking, la "sous-loc" (location auprès d'une entreprise classique)
          ou encore le "bureau opéré".
          <br />
          <br />
          En tant que startup de la Proptech, Ubiq facilite la lisibilité, la
          compréhension et l'accès à l'offre de bureau flexible. Ubiq transforme
          votre recherche de bureaux en expérience transparente au sein du
          secteur de l'immobilier d'entreprise traditionnellement opaque.
          <br />
          <br />
          Enfin Ubiq éprouve elle-même l'hybridation de l'organisation du
          travail et vous conseille par exemple sur le télétravail et le flex
          office :{" "}
          <a href="#" className="underline hover:no-underline">
            en savoir plus avec notre guide complet sur le flex office
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <FAQItem key={idx} {...faq} />
      ))}
    </div>
  );
}

type FAQProps = {
  question: string;
  answer: React.ReactNode;
};
function FAQItem({ question, answer }: FAQProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full shadow-sm rounded-lg border"
    >
      <CollapsibleTrigger className="flex items-center w-full justify-between gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition hover:shadow-sm">
        <span className="text-left font-bold">{question}</span>
        <ChevronRight
          className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">{answer}</CollapsibleContent>
    </Collapsible>
  );
}
