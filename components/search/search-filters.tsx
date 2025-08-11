"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MapPin,
  Users,
  Building,
  DollarSign,
  Filter,
  ChevronDown,
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

  const handleApplyFilters = () => {
    onApplyFilters();
    setActiveFilter(null);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setActiveFilter(null);
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
            resultCount={resultCount}
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
            resultCount={resultCount}
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
            resultCount={resultCount}
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
            resultCount={resultCount}
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
            resultCount={resultCount}
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="flex-shrink-0 bg-white px-6 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </section>
  );
}
