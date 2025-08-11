import React from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = Record<string, never>;

export default function LaunchSearchSection({}: Props) {
  return (
    <section className="pt-16 pb-12 bg-[#ffeee5]">
      <div className="max-w-7xl mx-auto gap-6 md:gap-10 flex flex-col px-4 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-0 font-roslindale">
          Comment voulez-vous lancer votre recherche ?
        </h2>

        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="text-[22px] font-bold">
              J'explore, je filtre et je trouve !
            </h2>
            <p>
              Parcourez tous les bureaux disponibles et filtrez selon vos
              critères.
            </p>
            <Image
              src="/budget-range.png"
              width={300}
              height={80}
              alt="Search Illustration"
              className="bg-white shadow-lg rounded-xl"
            />
            <Button asChild className="py-7 text-base px-5 mt-2">
              <Link href="/search">
                <Search className="!size-6 mr-2" />
                Voir 8 286 annonces
              </Link>
            </Button>
          </div>

          <div className="my-10 md:hidden flex justify-center items-center gap-2 w-full">
            <div className="h-[1px] w-full bg-gray-500 rounded-full"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="h-[1px] w-full bg-gray-500 rounded-full"></div>{" "}
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="text-[22px] font-bold">
              J'explore, je filtre et je trouve !
            </h2>
            <p>
              Parcourez tous les bureaux disponibles et filtrez selon vos
              critères.
            </p>

            <div className="relative w-full flex items-center justify-center flex-col">
              <div className="flex -space-x-4">
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar9.webp"
                  height={100}
                  width={100}
                  alt="Profile 9"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar1.webp"
                  width={100}
                  height={100}
                  alt="Profile 1"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar2.webp"
                  width={100}
                  height={100}
                  alt="Profile 2"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar3.webp"
                  width={100}
                  height={100}
                  alt="Profile 3"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar4.webp"
                  width={100}
                  height={100}
                  alt="Profile 4"
                />
              </div>
              <div className="relative bottom-3 flex -space-x-4">
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar5.webp"
                  width={100}
                  height={100}
                  alt="Profile 5"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar6.webp"
                  width={100}
                  height={100}
                  alt="Profile 6"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar7.webp"
                  width={100}
                  height={100}
                  alt="Profile 7"
                />
                <Image
                  className="size-12 rounded-full border-1 object-cover"
                  src="/avatar8.webp"
                  width={100}
                  height={100}
                  alt="Profile 8"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="py-7 text-base border-primary text-primary hover:bg-transparent hover:text-primary px-5"
            >
              Confier ma recherche
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
