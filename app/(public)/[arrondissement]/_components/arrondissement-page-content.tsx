"use client";

import { useState, useMemo, useEffect } from "react";
import GoogleMap from "../../search/google-map";
import { useSearchParams } from "@/hooks/use-search-params";
import { useOffices } from "@/hooks/use-offices";
import { usePendingFilters } from "@/hooks/use-pending-filters";
import { ArrondissementFilters } from "@/components/search/arrondissement-filters";
import { OfficeList } from "@/components/search/office-list";
import { MobileViewToggle } from "@/components/search/mobile-view-toggle";
import { useMapListSync } from "@/components/search/map-list-sync-provider";
import { GetOfficesParams } from "@/lib/api/offices";
import { useRouter } from "next/navigation";

interface ArrondissementPageContentProps {
  arrondissement: string;
}

export default function ArrondissementPageContent({
  arrondissement,
}: ArrondissementPageContentProps) {
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilteredOffices } = useMapListSync();
  const router = useRouter();

  const arrondissementNumber = parseInt(arrondissement, 10);

  const officesParams = useMemo((): GetOfficesParams => {
    const params: GetOfficesParams = {
      page: searchParams.page,
      limit: searchParams.limit,
      arr: arrondissementNumber,
    };

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
  }, [searchParams, arrondissementNumber]);

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
    router.push("/search");
  };

  const handleResetPosts = () => {
    updatePendingFilters({ minPosts: null, maxPosts: null });
    setSearchParams({
      ...searchParams,
      minPosts: null,
      maxPosts: null,
      page: 1,
    });
  };

  const handleResetType = () => {
    updatePendingFilters({ officeTypes: null, showCombinations: null });
    setSearchParams({
      ...searchParams,
      officeTypes: null,
      showCombinations: null,
      page: 1,
    });
  };

  const handleResetBudget = () => {
    updatePendingFilters({ minPrice: null, maxPrice: null });
    setSearchParams({
      ...searchParams,
      minPrice: null,
      maxPrice: null,
      page: 1,
    });
  };

  const handleResetServices = () => {
    updatePendingFilters({ services: null });
    setSearchParams({ ...searchParams, services: null, page: 1 });
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

  const hasAppliedFilters = Boolean(
    searchParams.minPosts ||
      searchParams.maxPosts ||
      searchParams.minPrice ||
      searchParams.maxPrice ||
      searchParams.services?.length ||
      searchParams.officeTypes?.length ||
      searchParams.showCombinations ||
      arrondissementNumber
  );

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col bg-background">
      <ArrondissementFilters
        appliedFilters={{ ...searchParams, arr: arrondissementNumber }}
        pendingFilters={pendingFilters}
        onPendingFiltersChange={updatePendingFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onResetPosts={handleResetPosts}
        onResetType={handleResetType}
        onResetBudget={handleResetBudget}
        onResetServices={handleResetServices}
        hasAppliedFilters={hasAppliedFilters}
        resultCount={pagination.total}
        arrondissementNumber={arrondissementNumber}
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
            arrondissementNumber={arrondissementNumber}
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
