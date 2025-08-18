import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ArrondissementPage from "../page";

vi.mock("@/hooks/use-offices", () => ({
  useOffices: () => ({
    offices: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-search-params", () => ({
  useSearchParams: () => [
    {
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
    },
    vi.fn(),
  ],
}));

vi.mock("@/hooks/use-pending-filters", () => ({
  usePendingFilters: () => ({
    pendingFilters: {
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
    },
    updatePendingFilters: vi.fn(),
    resetPendingFilters: vi.fn(),
  }),
}));

vi.mock("@/components/search/map-list-sync-provider", () => ({
  MapListSyncProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useMapListSync: () => ({
    filteredOffices: [],
    expandedOfficeId: null,
    setFilteredOffices: vi.fn(),
    setSelectedOfficeId: vi.fn(),
    setExpandedOfficeId: vi.fn(),
  }),
}));

vi.mock("@/components/search/search-provider", () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/search/arrondissement-filters", () => ({
  ArrondissementFilters: () => (
    <div data-testid="arrondissement-filters">Arrondissement Filters</div>
  ),
}));

vi.mock("@/components/search/office-list", () => ({
  OfficeList: ({ arrondissementNumber }: { arrondissementNumber?: number }) => (
    <div data-testid="office-list">
      Office List
      {arrondissementNumber && (
        <div>
          Bureaux dans le {arrondissementNumber}e arrondissement de Paris
        </div>
      )}
    </div>
  ),
}));

vi.mock("@/components/search/mobile-view-toggle", () => ({
  MobileViewToggle: () => (
    <div data-testid="mobile-view-toggle">Mobile View Toggle</div>
  ),
}));

vi.mock("../../search/google-map", () => ({
  default: () => <div data-testid="google-map">Google Map</div>,
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-maps-map">{children}</div>
  ),
  AdvancedMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="advanced-marker">{children}</div>
  ),
}));

describe("ArrondissementPage", () => {
  it("renders the page with correct arrondissement title for bureaux-paris-3", async () => {
    const params = Promise.resolve({ arrondissement_slug: "bureaux-paris-3" });

    render(await ArrondissementPage({ params }));

    expect(
      screen.getByText("Bureaux dans le 3e arrondissement de Paris")
    ).toBeInTheDocument();
  });

  it("renders all required components", async () => {
    const params = Promise.resolve({ arrondissement_slug: "bureaux-paris-5" });

    render(await ArrondissementPage({ params }));

    expect(screen.getByTestId("arrondissement-filters")).toBeInTheDocument();
    expect(screen.getByTestId("office-list")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-view-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("handles different arrondissement numbers", async () => {
    const params = Promise.resolve({ arrondissement_slug: "bureaux-paris-20" });

    render(await ArrondissementPage({ params }));

    expect(
      screen.getByText("Bureaux dans le 20e arrondissement de Paris")
    ).toBeInTheDocument();
  });

  it("throws error for invalid arrondissement format", async () => {
    const params = Promise.resolve({ arrondissement_slug: "invalid-format" });

    await expect(ArrondissementPage({ params })).rejects.toThrow(
      "Invalid arrondissement"
    );
  });

  it("throws error for arrondissement number out of range", async () => {
    const params = Promise.resolve({ arrondissement_slug: "bureaux-paris-25" });

    await expect(ArrondissementPage({ params })).rejects.toThrow(
      "Invalid arrondissement"
    );
  });
});
