import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

type Props = Record<string, never>;

export default function HowItWorksSection({}: Props) {
  return (
    <section className="pt-16 md:pt-32 pb-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 px-4 lg:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-roslindale">
          Nos fonctionnalités simplifient votre recherche
        </h2>

        <div className="flex flex-col gap-14">
          <div className="flex flex-col md:flex-row gap-8 w-full items-center">
            <Image
              src="/planning_x600.webp"
              alt="Planning"
              width={600}
              height={600}
            />
            <div className="flex flex-col gap-4 w-full px-4">
              <h3 className="font-bold">Planification des visites</h3>

              <p>
                Prenez les devants en partageant directement vos disponibilités
                lorsque vous contactez les annonces qui vous plaisent.
              </p>
              <p>
                Recevez automatiquement invitations, informations d'accès et
                rappels afin de ne rater aucune visite !
              </p>
              <div className="mt-auto flex justify-end px-4 pb-2 group-hover:bg-gray-50">
                <Button
                  variant="ghost"
                  className="underline hover:bg-transparent p-0"
                >
                  Explorer les bureaux <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 w-full items-center md:flex-row-reverse">
            <Image
              src="/recommandation_x600.webp"
              alt="Tableau de bord"
              width={600}
              height={600}
            />
            <div className="flex flex-col gap-4 w-full px-4">
              <h3 className="font-bold">
                Recommandations personnalisées & centralisées
              </h3>

              <p>
                Recevez et consultez à un endroit unique les recommandations de
                votre conseiller sur la base de vos critères.
              </p>
              <p>
                Acceptez ou déclinez chaque recommandation en expliquant
                pourquoi afin que votre conseiller cerne encore mieux vos
                priorités.
              </p>
              <div className="mt-auto flex justify-end px-4 pb-2 group-hover:bg-gray-50">
                <Button
                  variant="ghost"
                  className="underline hover:bg-transparent p-0"
                >
                  Explorer les bureaux <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 w-full items-center">
            <Image
              src="/board_x600.webp"
              alt="Planning"
              width={600}
              height={600}
            />
            <div className="flex flex-col gap-4 w-full px-4">
              <h3 className="font-bold">Tableau de bord de votre recherche</h3>

              <p>
                Visualisez simplement votre recherche et l'avancée de chaque
                discussion : en cours, visité, signé ou sans suite.
              </p>
              <p>
                Une discussion n'est pas à jour ? Faites-la avancer en la
                glissant dans la bonne colonne !
              </p>
              <div className="mt-auto flex justify-end px-4 pb-2 group-hover:bg-gray-50">
                <Button
                  variant="ghost"
                  className="underline hover:bg-transparent p-0"
                >
                  Explorer les bureaux <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
