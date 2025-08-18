import { render, screen, fireEvent } from "@testing-library/react";
import { SearchFilters } from "../search-filters";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockAppliedFilters = {
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
};

const mockPendingFilters = {
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
};

const mockProps = {
  appliedFilters: mockAppliedFilters,
  pendingFilters: mockPendingFilters,
  onPendingFiltersChange: vi.fn(),
  onApplyFilters: vi.fn(),
  onClearFilters: vi.fn(),
  onResetLocation: vi.fn(),
  onResetPosts: vi.fn(),
  onResetType: vi.fn(),
  onResetBudget: vi.fn(),
  onResetServices: vi.fn(),
  hasAppliedFilters: false,
  resultCount: 0,
};

describe("SearchFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter buttons", () => {
    render(<SearchFilters {...mockProps} />);

    expect(screen.getByText("Arrondissement")).toBeInTheDocument();
    expect(screen.getByText("Nombre de postes")).toBeInTheDocument();
    expect(screen.getByText("Type de bureaux")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });

  it("shows reset all button when filters are applied", () => {
    const propsWithFilters = {
      ...mockProps,
      hasAppliedFilters: true,
    };

    render(<SearchFilters {...propsWithFilters} />);

    expect(screen.getByText("Réinitialiser tout")).toBeInTheDocument();
  });

  it("does not show reset all button when no filters are applied", () => {
    render(<SearchFilters {...mockProps} />);

    expect(screen.queryByText("Réinitialiser tout")).not.toBeInTheDocument();
  });

  it("calls onClearFilters when reset all button is clicked", () => {
    const propsWithFilters = {
      ...mockProps,
      hasAppliedFilters: true,
    };

    render(<SearchFilters {...propsWithFilters} />);

    const resetButton = screen.getByText("Réinitialiser tout");
    fireEvent.click(resetButton);

    expect(mockProps.onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("shows active state for applied filters", () => {
    const propsWithActiveFilters = {
      ...mockProps,
      appliedFilters: {
        ...mockAppliedFilters,
        arr: 1,
        minPosts: 5,
        minPrice: 1000,
        services: [1, 2],
        officeTypes: ["independent"],
      },
    };

    render(<SearchFilters {...propsWithActiveFilters} />);

    expect(screen.getByText("1er arrondissement")).toBeInTheDocument();
    expect(screen.getByText("5+ postes")).toBeInTheDocument();
    expect(screen.getByText("1k€+")).toBeInTheDocument();
    expect(screen.getByText("2 services")).toBeInTheDocument();
    expect(screen.getByText("Indépendant")).toBeInTheDocument();
  });

  it("shows pending state for filters with pending changes", () => {
    const propsWithPendingFilters = {
      ...mockProps,
      pendingFilters: {
        ...mockPendingFilters,
        arr: 2,
      },
      appliedFilters: {
        ...mockAppliedFilters,
        arr: 1,
      },
    };

    render(<SearchFilters {...propsWithPendingFilters} />);

    const locationButton = screen
      .getByText("1er arrondissement")
      .closest("button");
    expect(locationButton).toHaveClass("border-orange-300");
  });

  it("hides location filter when hideLocationFilter is true", () => {
    render(<SearchFilters {...mockProps} hideLocationFilter={true} />);

    expect(screen.queryByText("Arrondissement")).not.toBeInTheDocument();
    expect(screen.getByText("Nombre de postes")).toBeInTheDocument();
    expect(screen.getByText("Type de bureaux")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });

  it("shows location filter when hideLocationFilter is false", () => {
    render(<SearchFilters {...mockProps} hideLocationFilter={false} />);

    expect(screen.getByText("Arrondissement")).toBeInTheDocument();
    expect(screen.getByText("Nombre de postes")).toBeInTheDocument();
    expect(screen.getByText("Type de bureaux")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });
});
