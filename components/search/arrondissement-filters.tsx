"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Filter,
  X,
  Users,
  Building,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Search,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PostsFilter } from "./filters/posts-filter";
import { TypeFilter } from "./filters/type-filter";
import { BudgetFilter } from "./filters/budget-filter";
import { ServicesFilter } from "./filters/services-filter";

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

interface PendingFilters {
  arr: number | null;
  minPosts: number | null;
  maxPosts: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  services: number[] | null;
  officeTypes: string[] | null;
  showCombinations: string | null;
}

interface ArrondissementFiltersProps {
  appliedFilters: SearchFilters;
  pendingFilters: PendingFilters;
  onPendingFiltersChange: (filters: Partial<PendingFilters>) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onResetPosts: () => void;
  onResetType: () => void;
  onResetBudget: () => void;
  onResetServices: () => void;
  hasAppliedFilters: boolean;
  resultCount: number;
  arrondissementNumber: number;
}

export function ArrondissementFilters({
  appliedFilters,
  pendingFilters,
  onPendingFiltersChange,
  onApplyFilters,
  onClearFilters,
  onResetPosts,
  onResetType,
  onResetBudget,
  onResetServices,
  hasAppliedFilters,
  resultCount,
  arrondissementNumber,
}: ArrondissementFiltersProps) {
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
    if (!appliedFilters.officeTypes?.length && !appliedFilters.showCombinations)
      return "Type d'espace";
    if (appliedFilters.showCombinations) return "Combinaisons";
    if (appliedFilters.officeTypes?.length === 1) {
      return appliedFilters.officeTypes[0];
    }
    return `${appliedFilters.officeTypes?.length} types`;
  };

  const getBudgetLabel = () => {
    if (!appliedFilters.minPrice && !appliedFilters.maxPrice) return "Budget";
    if (appliedFilters.minPrice && appliedFilters.maxPrice) {
      return `${appliedFilters.minPrice}€-${appliedFilters.maxPrice}€`;
    }
    if (appliedFilters.minPrice) return `${appliedFilters.minPrice}€+`;
    if (appliedFilters.maxPrice) return `≤${appliedFilters.maxPrice}€`;
    return "Budget";
  };

  const getServicesLabel = () => {
    if (!appliedFilters.services?.length) return "Filtres";
    return appliedFilters.services.length === 1
      ? "1 service"
      : `${appliedFilters.services.length} services`;
  };

  const getArrondissementLabel = () => {
    const arrondissementLabels: { [key: number]: string } = {
      1: "1er arrondissement",
      2: "2e arrondissement",
      3: "3e arrondissement",
      4: "4e arrondissement",
      5: "5e arrondissement",
      6: "6e arrondissement",
      7: "7e arrondissement",
      8: "8e arrondissement",
      9: "9e arrondissement",
      10: "10e arrondissement",
      11: "11e arrondissement",
      12: "12e arrondissement",
      13: "13e arrondissement",
      14: "14e arrondissement",
      15: "15e arrondissement",
      16: "16e arrondissement",
      17: "17e arrondissement",
      18: "18e arrondissement",
      19: "19e arrondissement",
      20: "20e arrondissement",
    };
    return arrondissementLabels[arrondissementNumber] || "Arrondissement";
  };

  const filterButtons = [
    {
      id: "arrondissement",
      label: getArrondissementLabel(),
      icon: MapPin,
      active: true,
      pending: false,
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
      case "arrondissement":
        return (
          <div className="p-4">
            <div className="text-center text-gray-600">
              <p className="text-sm">Vous consultez actuellement</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {getArrondissementLabel()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {resultCount} bureau{resultCount > 1 ? "x" : ""} disponible
                {resultCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>
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
            onClear={onResetPosts}
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
            onClear={onResetType}
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
            onClear={onResetBudget}
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
            onClear={onResetServices}
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
          className={cn(
            "w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50"
          )}
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
      {hasAppliedFilters && (
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="size-5 text-gray-500" />
            <span className="text-gray-900 font-medium">
              Réinitialiser tout
            </span>
          </div>
        </button>
      )}
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
            onClick={onClearFilters}
            className="flex items-center gap-2 text-gray-600"
          >
            <RotateCcw className="size-4" />
            <span>Réinitialiser tout</span>
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

          {hasAppliedFilters && (
            <div className="hidden md:block">
              <Button
                variant="outline"
                size="lg"
                onClick={onClearFilters}
                className="gap-2 text-gray-600 hover:text-gray-800 px-4 py-6"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser tout
              </Button>
            </div>
          )}

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
