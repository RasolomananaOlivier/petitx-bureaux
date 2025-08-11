import { Star, HandshakeIcon, MapPinned, Timer } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

type Props = Record<string, never>;

export default function ProfSection({}: Props) {
  return (
    // Main container with light blue-gray background
    <div className="pt-12 pb-10 bg-[#EBF1F7] ">
      <div className=" max-w-7xl mx-auto gap-6 flex flex-col px-4 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-0 font-roslindale">
            Plus de 50 ans d'expérience cumulée
          </h2>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-medium text-gray-900 text-nowrap">
              Excellent 4.9 sur 5
            </span>
            <Star className="h-5 w-5 fill-green-500 text-green-500" />
            <span className="text-sm font-medium text-gray-900">
              Trustpilot
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 w-full">
          <div className="relative w-full lg:w-5/12 flex justify-center shrink-0 items-stretch">
            {/* Main office image with rounded corners */}
            <div className="w-[300px] md:w-full md:pl-12">
              <Image
                src="/232x.webp"
                alt="Office space with desks"
                width={400}
                height={232}
                className="rounded-lg"
              />
            </div>

            {/* Overlapping profile avatars group */}
            <div className="absolute bottom-3 md:bottom-[130px] left-[48%] md:left-[53%] -translate-x-1/2 flex -space-x-4">
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar1.webp"
                width={100}
                height={100}
                alt="Profile 1"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar2.webp"
                width={100}
                height={100}
                alt="Profile 2"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar3.webp"
                width={100}
                height={100}
                alt="Profile 3"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar4.webp"
                width={100}
                height={100}
                alt="Profile 4"
              />
            </div>
            <div className="absolute -bottom-6 md:bottom-[70px] left-[49%] -translate-x-1/2 flex -space-x-4">
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar5.webp"
                width={100}
                height={100}
                alt="Profile 5"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar6.webp"
                width={100}
                height={100}
                alt="Profile 6"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar7.webp"
                width={100}
                height={100}
                alt="Profile 7"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar8.webp"
                width={100}
                height={100}
                alt="Profile 8"
              />
              <Image
                className="size-12 md:size-20 rounded-full border-1 object-cover"
                src="/avatar9.webp"
                height={100}
                width={100}
                alt="Profile 9"
              />
            </div>
          </div>

          {/* Right section: Header, text, features, and button */}
          <div className="w-full lg:w-7/12 flex flex-col md:pt-12 lg:pt-0 ">
            {/* Main body text paragraphs */}
            <p className="text-sm sm:text-base text-black leading-relaxed mb-4">
              Faites équipe avec la meilleure équipe : avec{" "}
              <span className="font-bold">
                plus de 50 ans d'expérience cumulée
              </span>
              , nos experts ont une parfaite connaissance individuelle et
              collective du terrain.
            </p>
            <p className="text-sm sm:text-base text-black leading-relaxed mb-8">
              Selon les avis clients reçus, ils sont "pertinents", "disponibles"
              et "efficaces" pour vous éclairer sur le marché et trouver avec
              vous le bureau qu'il vous faut au bon prix.
            </p>

            {/* Three-column feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="flex flex-row items-center md:flex-col md:items-start gap-3 md:gap-0">
                {/* Icon placeholder (using Lucide React) */}
                <HandshakeIcon className="text-2xl text-gray-900" size={26} />
                <div>
                  <p className="text-lg font-bold text-[#111111]  pt-1">
                    jusqu'à 15%
                  </p>
                  <p className="text-gray-900">négociation sur les prix</p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-row items-center md:flex-col md:items-start gap-3 md:gap-0">
                {/* Icon placeholder (using Lucide React) */}
                <MapPinned className="text-2xl text-gray-900" size={26} />
                <div>
                  {" "}
                  <p className="text-lg font-bold text-[#111111] pt-1">100%</p>
                  <p className="text-gray-900">connaissance du marché</p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-row items-center md:flex-col md:items-start gap-3 md:gap-0">
                {/* Icon placeholder (using Lucide React) */}
                <Timer className="text-2xl text-gray-900" size={26} />
                <div>
                  <p className="text-lg font-bold text-[#111111] pt-1">
                    15 minutes
                  </p>
                  <p className="text-gray-900">temps de réponse moyen</p>
                </div>
              </div>
            </div>

            {/* Call-to-action button */}
            <div className="mt-auto self-end pt-10">
              <Button size="lg" className="py-7 text-base px-6 font-bold">
                Confier ma recherche
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
