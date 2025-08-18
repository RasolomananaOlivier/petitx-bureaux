import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ArrondissementFilters } from "../arrondissement-filters";

const mockProps = {
  appliedFilters: {
    page: 1,
    limit: 12,
    arr: 3,
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
  pendingFilters: {
    arr: 3,
    minPosts: null,
    maxPosts: null,
    minPrice: null,
    maxPrice: null,
    services: null,
    officeTypes: null,
    showCombinations: null,
  },
  onPendingFiltersChange: vi.fn(),
  onApplyFilters: vi.fn(),
  onClearFilters: vi.fn(),
  onResetPosts: vi.fn(),
  onResetType: vi.fn(),
  onResetBudget: vi.fn(),
  onResetServices: vi.fn(),
  hasAppliedFilters: false,
  resultCount: 25,
  arrondissementNumber: 3,
};

describe("ArrondissementFilters", () => {
  it("renders arrondissement label", () => {
    render(<ArrondissementFilters {...mockProps} />);

    expect(screen.getByText("3e arrondissement")).toBeInTheDocument();
  });

  it("renders all filter buttons", () => {
    render(<ArrondissementFilters {...mockProps} />);

    expect(screen.getByText("Nombre de postes")).toBeInTheDocument();
    expect(screen.getByText("Type d'espace")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });

  it("shows clear filters button when hasAppliedFilters is true", () => {
    render(<ArrondissementFilters {...mockProps} hasAppliedFilters={true} />);

    expect(screen.getByText("Réinitialiser tout")).toBeInTheDocument();
  });

  it("calls onClearFilters when clear filters button is clicked", () => {
    render(<ArrondissementFilters {...mockProps} hasAppliedFilters={true} />);

    fireEvent.click(screen.getByText("Réinitialiser tout"));
    expect(mockProps.onClearFilters).toHaveBeenCalled();
  });

  it("shows active filter state correctly", () => {
    const propsWithActiveFilters = {
      ...mockProps,
      appliedFilters: {
        ...mockProps.appliedFilters,
        minPosts: 5,
        maxPrice: 1000,
      },
    };

    render(<ArrondissementFilters {...propsWithActiveFilters} />);

    expect(screen.getByText("5+ postes")).toBeInTheDocument();
    expect(screen.getByText("≤1000€")).toBeInTheDocument();
  });

  it("handles different arrondissement numbers", () => {
    const propsWithDifferentArr = {
      ...mockProps,
      arrondissementNumber: 1,
    };

    render(<ArrondissementFilters {...propsWithDifferentArr} />);

    expect(screen.getByText("1er arrondissement")).toBeInTheDocument();
  });
});
