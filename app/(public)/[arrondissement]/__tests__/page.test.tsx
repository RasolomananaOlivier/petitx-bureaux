import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import ArrondissementPage from "../page";
import { SearchProvider } from "@/components/search/search-provider";
import { MapListSyncProvider } from "@/components/search/map-list-sync-provider";

vi.mock("@/components/search/search-provider", () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="search-provider">{children}</div>
  ),
}));

vi.mock("@/components/search/map-list-sync-provider", () => ({
  MapListSyncProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-list-sync-provider">{children}</div>
  ),
  useMapListSync: () => ({
    setFilteredOffices: vi.fn(),
    hoveredOfficeId: null,
    expandedOfficeId: null,
    setSelectedOfficeId: vi.fn(),
    setExpandedOfficeId: vi.fn(),
  }),
}));

vi.mock("@/components/search/arrondissement-filters", () => ({
  ArrondissementFilters: ({
    arrondissementNumber,
  }: {
    arrondissementNumber: number;
  }) => (
    <div data-testid="arrondissement-filters">
      Arrondissement {arrondissementNumber} Filters
    </div>
  ),
}));

vi.mock("@/components/search/office-list", () => ({
  OfficeList: ({ arrondissementNumber }: { arrondissementNumber: number }) => (
    <div data-testid="office-list">
      Office List for Arrondissement {arrondissementNumber}
    </div>
  ),
}));

vi.mock("@/components/search/mobile-view-toggle", () => ({
  MobileViewToggle: () => (
    <div data-testid="mobile-view-toggle">Mobile View Toggle</div>
  ),
}));

vi.mock("@/hooks/use-search-params", () => ({
  useSearchParams: () => [
    {
      page: 1,
      limit: 12,
      arr: 1,
      minPosts: null,
      maxPosts: null,
      minPrice: null,
      maxPrice: null,
      services: null,
      sortBy: "created_at",
      sortOrder: "desc",
      search: null,
      officeTypes: null,
      showCombinations: null,
    },
    vi.fn(),
  ],
}));

vi.mock("@/hooks/use-offices", () => ({
  useOffices: () => ({
    offices: [],
    pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-pending-filters", () => ({
  usePendingFilters: () => ({
    pendingFilters: {},
    updatePendingFilters: vi.fn(),
    resetPendingFilters: vi.fn(),
  }),
}));

vi.mock("@/components/search/map-list-sync-provider", () => ({
  useMapListSync: () => ({
    setFilteredOffices: vi.fn(),
    hoveredOfficeId: null,
    expandedOfficeId: null,
    setSelectedOfficeId: vi.fn(),
    setExpandedOfficeId: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  AdvancedMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="advanced-marker">{children}</div>
  ),
  useMap: () => ({
    setCenter: vi.fn(),
    setZoom: vi.fn(),
  }),
}));

vi.mock("../../search/google-map", () => ({
  default: ({ arrondissementNumber }: { arrondissementNumber?: number }) => (
    <div data-testid="google-map-component">
      Google Map Component
      {arrondissementNumber && (
        <div data-testid="arrondissement-boundary">
          Arrondissement {arrondissementNumber} Boundary
        </div>
      )}
    </div>
  ),
}));

describe("ArrondissementPage", () => {
  it("renders arrondissement page with correct props", async () => {
    const params = Promise.resolve({ arrondissement: "bureaux-paris-1" });

    const { container } = render(await ArrondissementPage({ params }));

    expect(container).toBeInTheDocument();
    expect(screen.getByTestId("search-provider")).toBeInTheDocument();
    expect(screen.getByTestId("map-list-sync-provider")).toBeInTheDocument();
    expect(screen.getByTestId("arrondissement-filters")).toBeInTheDocument();
    expect(screen.getByTestId("office-list")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-view-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("extracts arrondissement number correctly", async () => {
    const params = Promise.resolve({ arrondissement: "bureaux-paris-5" });

    render(await ArrondissementPage({ params }));

    expect(screen.getByText("Arrondissement 5 Filters")).toBeInTheDocument();
    expect(
      screen.getByText("Office List for Arrondissement 5")
    ).toBeInTheDocument();
  });

  it("handles invalid arrondissement slug", async () => {
    const params = Promise.resolve({ arrondissement: "invalid-slug" });

    await expect(ArrondissementPage({ params })).rejects.toThrow(
      "Invalid arrondissement"
    );
  });

  it("handles out of range arrondissement number", async () => {
    const params = Promise.resolve({ arrondissement: "bureaux-paris-25" });

    await expect(ArrondissementPage({ params })).rejects.toThrow(
      "Invalid arrondissement"
    );
  });

  it("generates static params for all arrondissements", async () => {
    const { generateStaticParams } = await import("../page");
    const staticParams = await generateStaticParams();

    expect(staticParams).toHaveLength(20);
    expect(staticParams[0]).toEqual({ arrondissement: "bureaux-paris-1" });
    expect(staticParams[19]).toEqual({ arrondissement: "bureaux-paris-20" });
  });
});
