"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import GoogleMap from "./google-map";
import { useSearchParams } from "@/hooks/use-search-params";
import { useOffices } from "@/hooks/use-offices";
import { usePendingFilters } from "@/hooks/use-pending-filters";
import { SearchFilters } from "@/components/search/search-filters";
import { OfficeList } from "@/components/search/office-list";
import { MobileViewToggle } from "@/components/search/mobile-view-toggle";
import { SearchProvider } from "@/components/search/search-provider";
import {
  MapListSyncProvider,
  useMapListSync,
} from "@/components/search/map-list-sync-provider";
import { GetOfficesParams } from "@/lib/api/offices";

function SearchPageContent() {
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilteredOffices } = useMapListSync();

  const officesParams = useMemo((): GetOfficesParams => {
    const params: GetOfficesParams = {
      page: searchParams.page,
      limit: searchParams.limit,
    };

    if (searchParams.arr) params.arr = searchParams.arr;
    if (searchParams.minPosts) params.minPosts = searchParams.minPosts;
    if (searchParams.maxPosts) params.maxPosts = searchParams.maxPosts;
    if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
    if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;
    if (searchParams.services?.length) params.services = searchParams.services;
    if (searchParams.sortBy)
      params.sortBy = searchParams.sortBy as "price" | "posts" | "created_at";
    if (searchParams.sortOrder)
      params.sortOrder = searchParams.sortOrder as "asc" | "desc";

    return params;
  }, [searchParams]);

  const { offices, pagination, loading, error, refetch } = useOffices();

  const { pendingFilters, updatePendingFilters, resetPendingFilters } =
    usePendingFilters(searchParams);

  useEffect(() => {
    console.log("officesParams", officesParams);
    refetch(officesParams);
  }, [officesParams, refetch]);

  useEffect(() => {
    setFilteredOffices(offices);
  }, [offices, setFilteredOffices]);

  const handleApplyFilters = () => {
    setSearchParams({ ...pendingFilters, page: 1 });
  };

  const handleClearFilters = () => {
    resetPendingFilters();
    setSearchParams({
      page: 1,
      limit: 12,
      arr: null,
      minPosts: null,
      maxPosts: null,
      minPrice: null,
      maxPrice: null,
      services: null,
      sortBy: "created_at",
      sortOrder: "desc",
      search: null,
      location: null,
      officeTypes: null,
      showCombinations: null,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSearchParams({ sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page });
  };

  const toggleMobileView = () => {
    setMobileView((v) => (v === "list" ? "map" : "list"));
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col bg-background">
      <SearchFilters
        appliedFilters={searchParams}
        pendingFilters={pendingFilters}
        onPendingFiltersChange={updatePendingFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        resultCount={pagination.total}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={
            "bg-white border-r border-gray-100 flex flex-col " +
            "w-full md:w-[520px] lg:w-[800px] shrink-0 " +
            (mobileView === "map" ? "hidden md:flex" : "flex")
          }
        >
          <OfficeList
            offices={offices}
            pagination={pagination}
            loading={loading}
            error={error}
            sortBy={searchParams.sortBy}
            sortOrder={searchParams.sortOrder}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
          />
        </aside>

        <main
          className={
            "flex-1 h-full " +
            (mobileView === "list" ? "hidden md:block" : "block")
          }
        >
          <div className="w-full h-full">
            <GoogleMap />
          </div>
        </main>
      </div>

      <MobileViewToggle mobileView={mobileView} onToggle={toggleMobileView} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchProvider>
      <MapListSyncProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchPageContent />
        </Suspense>
      </MapListSyncProvider>
    </SearchProvider>
  );
}
