"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { OfficeCard } from "@/components/sections/latest-office-section";
import { OfficeWithRelations } from "@/features/offices/types";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface OfficeListProps {
  offices: OfficeWithRelations[];
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onPageChange: (page: number) => void;
}

export function OfficeList({
  offices,
  pagination,
  loading,
  error,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
}: OfficeListProps) {
  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split(":");
    onSortChange(newSortBy, newSortOrder);
  };

  const getCurrentSortValue = () => {
    return `${sortBy}:${sortOrder}`;
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Une erreur est survenue</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-10">
        <div className="p-4 grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide md:px-2 pb-10">
      <div className="flex flex-col gap-4 p-4">
        <div className="text-lg md:text-xl text-gray-700 font-bold flex flex-row items-center justify-between gap-3">
          <span>{pagination.total.toLocaleString()} espaces</span>

          <Select
            value={getCurrentSortValue()}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-9 w-auto text-sm md:text-base">
              <SelectValue placeholder="Tri : Recommandations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">
                Tri : Recommandations
              </SelectItem>
              <SelectItem value="price:asc">Prix croissant</SelectItem>
              <SelectItem value="price:desc">Prix décroissant</SelectItem>
              <SelectItem value="posts:asc">Postes croissant</SelectItem>
              <SelectItem value="posts:desc">Postes décroissant</SelectItem>
              <SelectItem value="created_at:asc">Plus anciens</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {offices.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Aucun bureau trouvé</p>
              <p className="text-sm text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offices.map((office, index) => (
              <OfficeCard key={index} office={office} />
            ))}

            {pagination.totalPages > 1 && (
              <div className="col-span-2 mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
