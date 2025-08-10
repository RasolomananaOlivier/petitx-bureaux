import React from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

type Props = {};

export default function PartenersSection({}: Props) {
  return (
    <section className="pb-15 px-20 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-[22px] font-bold mb-12">
          PetitsBureaux est partenaire de tous les acteurs du bureau flexible
        </h2>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-8">
          {/* Row 1 */}
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">wework</span>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">morning</span>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">DESKEO</span>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">WOJO</span>
          </div>
          <div className="flex items-center justify-center h-16">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-white text-xs font-bold">SW</span>
              </div>
              <span className="text-sm font-bold text-gray-800">STARTWAY</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-16">
            <div className="text-center">
              <span className="text-lg font-bold text-gray-800">Flow</span>
              <div className="text-xs text-gray-600">bureaux all-in</div>
            </div>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">
              NEWTON OFFICES
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">kwərk</span>
          </div>
          <div className="flex items-center justify-center h-16">
            <div className="text-center">
              <div className="w-6 h-6 bg-gray-800 mx-auto mb-1"></div>
              <span className="text-sm font-bold text-gray-800">
                les nouveaux bureaux
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">
              myflexoffice
            </span>
          </div>
          <div className="flex items-center justify-center h-16">
            <div className="text-center">
              <div className="w-6 h-6 bg-gray-800 transform rotate-45 mx-auto mb-1"></div>
              <span className="text-lg font-bold text-gray-800">SPACES.</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-16">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">w</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">wellio</span>
          </div>
          <div className="flex items-center justify-center h-16">
            <span className="text-lg font-bold text-gray-800">BUREAUX+</span>
          </div>
        </div>

        <p className=" text-black mb-12">
          ... et bien d'autres que vous ne connaissez pas encore !
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              className="py-6 text-base border-gray-300 text-gray-700 hover:bg-gray-50 px-4"
            >
              Confier ma recherche
            </Button>
            <Button className="py-6 text-base px-4">
              <Search className="!size-6 mr-2" />
              Voir 8 286 annonces
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
