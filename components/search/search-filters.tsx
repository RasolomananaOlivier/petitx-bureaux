"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MapPin,
  Users,
  Building,
  DollarSign,
  Filter,
  ChevronDown,
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationFilter } from "./filters/location-filter";
import { PostsFilter } from "./filters/posts-filter";
import { TypeFilter } from "./filters/type-filter";
import { BudgetFilter } from "./filters/budget-filter";
import { ServicesFilter } from "./filters/services-filter";
import { PendingFilters } from "@/hooks/use-pending-filters";

interface SearchFilters {
  page: number;
  limit: number;
  arr: number | null;
  minPosts: number | null;
  maxPosts: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  services: number[] | null;
  sortBy: string;
  sortOrder: string;
  search: string | null;
  location: string[] | null;
  officeTypes: string[] | null;
  showCombinations: string | null;
}

interface SearchFiltersProps {
  appliedFilters: SearchFilters;
  pendingFilters: PendingFilters;
  onPendingFiltersChange: (filters: Partial<PendingFilters>) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  resultCount: number;
}

export function SearchFilters({
  appliedFilters,
  pendingFilters,
  onPendingFiltersChange,
  onApplyFilters,
  onClearFilters,
  resultCount,
}: SearchFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMobileFilter, setSelectedMobileFilter] = useState<
    string | null
  >(null);

  const handleApplyFilters = () => {
    onApplyFilters();
    setActiveFilter(null);
    setMobileFilterOpen(false);
    setSelectedMobileFilter(null);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setActiveFilter(null);
    setMobileFilterOpen(false);
    setSelectedMobileFilter(null);
  };

  const getLocationLabel = () => {
    if (!appliedFilters.location?.length) return "Localisation";
    const locations = appliedFilters.location.map(
      (loc) => loc.charAt(0).toUpperCase() + loc.slice(1)
    );
    return locations.length === 1 ? locations[0] : `${locations.length} villes`;
  };

  const getPostsLabel = () => {
    if (!appliedFilters.minPosts && !appliedFilters.maxPosts)
      return "Nombre de postes";
    if (appliedFilters.minPosts && appliedFilters.maxPosts) {
      return `${appliedFilters.minPosts}-${appliedFilters.maxPosts} postes`;
    }
    if (appliedFilters.minPosts) return `${appliedFilters.minPosts}+ postes`;
    if (appliedFilters.maxPosts) return `≤${appliedFilters.maxPosts} postes`;
    return "Nombre de postes";
  };

  const getTypeLabel = () => {
    if (
      !appliedFilters.officeTypes?.length &&
      !appliedFilters.showCombinations
    ) {
      return "Type de bureaux";
    }
    const typeLabels: { [key: string]: string } = {
      independent: "Indépendant",
      private: "Privé",
      shared: "Partagé",
    };
    const types =
      appliedFilters.officeTypes
        ?.map((type) => typeLabels[type])
        .filter(Boolean) || [];
    if (appliedFilters.showCombinations) types.push("Combinaisons");
    return types.length === 1 ? types[0] : `${types.length} types`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return price.toString();
  };

  const getBudgetLabel = () => {
    if (!appliedFilters.minPrice && !appliedFilters.maxPrice) return "Budget";
    if (appliedFilters.minPrice && appliedFilters.maxPrice) {
      return `${formatPrice(appliedFilters.minPrice)} - ${formatPrice(
        appliedFilters.maxPrice
      )}€`;
    }
    if (appliedFilters.minPrice)
      return `${formatPrice(appliedFilters.minPrice)}€+`;
    if (appliedFilters.maxPrice)
      return `≤${formatPrice(appliedFilters.maxPrice)}€`;
    return "Budget";
  };

  const getServicesLabel = () => {
    if (!appliedFilters.services?.length) return "Filtres";
    return appliedFilters.services.length === 1
      ? "1 service"
      : `${appliedFilters.services.length} services`;
  };

  const filterButtons = [
    {
      id: "location",
      label: getLocationLabel(),
      icon: MapPin,
      active: Boolean(appliedFilters.location?.length),
      pending: Boolean(
        pendingFilters.location?.length !== appliedFilters.location?.length ||
          JSON.stringify(pendingFilters.location) !==
            JSON.stringify(appliedFilters.location)
      ),
    },
    {
      id: "posts",
      label: getPostsLabel(),
      icon: Users,
      active: Boolean(appliedFilters.minPosts || appliedFilters.maxPosts),
      pending: Boolean(
        pendingFilters.minPosts !== appliedFilters.minPosts ||
          pendingFilters.maxPosts !== appliedFilters.maxPosts
      ),
    },
    {
      id: "type",
      label: getTypeLabel(),
      icon: Building,
      active: Boolean(
        appliedFilters.officeTypes?.length || appliedFilters.showCombinations
      ),
      pending: Boolean(
        JSON.stringify(pendingFilters.officeTypes) !==
          JSON.stringify(appliedFilters.officeTypes) ||
          pendingFilters.showCombinations !== appliedFilters.showCombinations
      ),
    },
    {
      id: "budget",
      label: getBudgetLabel(),
      icon: DollarSign,
      active: Boolean(appliedFilters.minPrice || appliedFilters.maxPrice),
      pending: Boolean(
        pendingFilters.minPrice !== appliedFilters.minPrice ||
          pendingFilters.maxPrice !== appliedFilters.maxPrice
      ),
    },
    {
      id: "filters",
      label: getServicesLabel(),
      icon: Filter,
      active: Boolean(appliedFilters.services?.length),
      pending: Boolean(
        JSON.stringify(pendingFilters.services) !==
          JSON.stringify(appliedFilters.services)
      ),
    },
  ];

  const renderFilterContent = (filterId: string) => {
    switch (filterId) {
      case "location":
        return (
          <LocationFilter
            value={pendingFilters.location}
            onChange={(value) => onPendingFiltersChange({ location: value })}
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        );

      case "posts":
        return (
          <PostsFilter
            minPosts={pendingFilters.minPosts}
            maxPosts={pendingFilters.maxPosts}
            onMinPostsChange={(value) =>
              onPendingFiltersChange({ minPosts: value })
            }
            onMaxPostsChange={(value) =>
              onPendingFiltersChange({ maxPosts: value })
            }
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        );

      case "type":
        return (
          <TypeFilter
            officeTypes={pendingFilters.officeTypes}
            showCombinations={pendingFilters.showCombinations}
            onOfficeTypesChange={(value) =>
              onPendingFiltersChange({ officeTypes: value })
            }
            onShowCombinationsChange={(value) =>
              onPendingFiltersChange({ showCombinations: value })
            }
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        );

      case "budget":
        return (
          <BudgetFilter
            minPrice={pendingFilters.minPrice}
            maxPrice={pendingFilters.maxPrice}
            onMinPriceChange={(value) =>
              onPendingFiltersChange({ minPrice: value })
            }
            onMaxPriceChange={(value) =>
              onPendingFiltersChange({ maxPrice: value })
            }
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        );

      case "filters":
        return (
          <ServicesFilter
            services={pendingFilters.services}
            onServicesChange={(value) =>
              onPendingFiltersChange({ services: value })
            }
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        );

      default:
        return null;
    }
  };

  const renderMobileFilterList = () => (
    <div className="space-y-0">
      {filterButtons.map((button) => (
        <button
          key={button.id}
          onClick={() => setSelectedMobileFilter(button.id)}
          className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <button.icon
              className={cn(
                "size-5 text-gray-500",
                button.active && "text-primary",
                button.pending && "text-orange-600"
              )}
            />
            <span className="text-gray-900 font-medium">{button.label}</span>
          </div>
          <ChevronRight className="size-4 text-gray-400" />
        </button>
      ))}
    </div>
  );

  const renderMobileFilterContent = () => {
    if (!selectedMobileFilter) return renderMobileFilterList();

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={() => setSelectedMobileFilter(null)}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft className="size-5" />
            <span>Retour</span>
          </button>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-gray-600"
          >
            <RotateCcw className="size-4" />
            <span>Réinitialiser</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {renderFilterContent(selectedMobileFilter)}
        </div>
      </div>
    );
  };

  return (
    <section className="flex-shrink-0 bg-white px-4 md:px-6 pb-4 md:py-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            {filterButtons.map((button) => (
              <Popover
                key={button.id}
                open={activeFilter === button.id}
                onOpenChange={(open) =>
                  setActiveFilter(open ? button.id : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={button.active ? "default" : "outline"}
                    size="lg"
                    className={`px-4 py-6 gap-2 text-gray-950 hover:bg-transparent relative ${
                      button.active
                        ? "bg-blue-50 border-primary border-1 text-primary hover:bg-blue-50"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    } ${
                      button.pending ? "border-orange-300 bg-orange-50" : ""
                    }`}
                  >
                    {button.pending && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                    )}
                    <button.icon
                      className={cn(
                        "!size-5 text-gray-500",
                        button.active && "text-primary",
                        button.pending && "text-orange-600"
                      )}
                    />
                    <span className="font-bold">{button.label}</span>
                    {button.id === "type" && (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-6" align="start">
                  {renderFilterContent(button.id)}
                </PopoverContent>
              </Popover>
            ))}
          </div>

          <div className="md:hidden w-full">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 py-6 gap-2 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 w-full"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="!size-5 text-gray-500" />
                    <span className="text-gray-400">Modifier ma recherche</span>
                  </div>
                  <SlidersHorizontal className="h-3 w-3" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] p-0">
                <SheetHeader className="px-4 py-3 border-b border-gray-100">
                  <SheetTitle className="text-left text-lg font-bold">
                    Modifier ma recherche
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  {renderMobileFilterContent()}
                </div>
                {selectedMobileFilter && (
                  <div className="p-4 border-t border-gray-100">
                    <Button
                      onClick={handleApplyFilters}
                      className="w-full py-3 text-base font-semibold"
                    >
                      {resultCount.toLocaleString()} résultats
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
