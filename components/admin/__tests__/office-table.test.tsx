import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OfficeTable } from "../office-table";
import * as adminOfficesHook from "@/hooks/use-admin-offices";
import type { PaginatedOfficesResponse } from "@/features/offices/types";

const mockOfficesResponse: PaginatedOfficesResponse = {
  offices: [
    {
      id: 1,
      title: "Bureau Test 1",
      description: "Description test 1",
      slug: "bureau-test-1",
      arr: 1,
      priceCents: 5000,
      nbPosts: 4,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      publishedAt: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      photos: [
        {
          id: 1,
          officeId: 1,
          url: "https://example.com/photo1.jpg",
          alt: "Photo 1",
          createdAt: new Date("2024-01-01"),
        },
      ],
      officeServices: [
        {
          id: 1,
          officeId: 1,
          serviceId: 1,
          createdAt: "2024-01-01T00:00:00.000Z",
          service: {
            id: 1,
            name: "WiFi",
            icon: "wifi",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        },
      ],
    },
    {
      id: 2,
      title: "Bureau Test 2",
      description: "Description test 2",
      slug: "bureau-test-2",
      arr: 2,
      priceCents: 7500,
      nbPosts: 6,
      lat: 48.8606,
      lng: 2.3376,
      isFake: true,
      publishedAt: null,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      photos: [],
      officeServices: [],
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

const mockEmptyResponse: PaginatedOfficesResponse = {
  offices: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

const mockPaginatedResponse: PaginatedOfficesResponse = {
  ...mockOfficesResponse,
  pagination: {
    page: 1,
    limit: 1,
    total: 2,
    totalPages: 2,
    hasNext: true,
    hasPrev: false,
  },
  offices: [mockOfficesResponse.offices[0]],
};

vi.mock("@/hooks/use-admin-offices");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "TestWrapper";

  return Wrapper;
};

describe("OfficeTable", () => {
  const mockUseAdminOffices = vi.mocked(adminOfficesHook.useAdminOffices);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton")).toHaveLength(48);
  });

  it("should render offices table with data", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    expect(screen.getByText("Bureau Test 2")).toBeInTheDocument();
    expect(screen.getByText("Bureaux (2)")).toBeInTheDocument();
    expect(screen.getByText("50.00€")).toBeInTheDocument();
    expect(screen.getByText("75.00€")).toBeInTheDocument();
    expect(screen.getByText("1ème")).toBeInTheDocument();
    expect(screen.getByText("2ème")).toBeInTheDocument();
  });

  it("should display published and draft status correctly", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Publié")).toBeInTheDocument();
    expect(screen.getByText("Brouillon")).toBeInTheDocument();
  });

  it("should display fake and real office types correctly", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Réel")).toBeInTheDocument();
    expect(screen.getByText("Factice")).toBeInTheDocument();
  });

  it("should handle API error gracefully", async () => {
    const mockRefetch = vi.fn();
    mockUseAdminOffices.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("API Error"),
      refetch: mockRefetch,
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("API Error")).toBeInTheDocument();
    expect(screen.getByText("Réessayer")).toBeInTheDocument();
  });

  it("should retry loading on error button click", async () => {
    const mockRefetch = vi.fn();
    mockUseAdminOffices.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("API Error"),
      refetch: mockRefetch,
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Réessayer")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Réessayer"));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("should call hook with search query", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="test search" />, {
      wrapper: createWrapper(),
    });

    expect(mockUseAdminOffices).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: "test search",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("should call hook without search when query is empty", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(mockUseAdminOffices).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("should handle sorting by title", async () => {
    const mockRefetch = vi.fn();
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    const titleSortButton = screen.getByRole("button", { name: /nom/i });
    fireEvent.click(titleSortButton);

    expect(mockUseAdminOffices).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: undefined,
      sortBy: "title",
      sortOrder: "asc",
    });
  });

  it("should toggle sort order when clicking same field", async () => {
    const mockRefetch = vi.fn();
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    const createdAtSortButton = screen.getByRole("button", {
      name: /créé le/i,
    });

    fireEvent.click(createdAtSortButton);

    expect(mockUseAdminOffices).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: undefined,
      sortBy: "createdAt",
      sortOrder: "asc",
    });
  });

  it("should render pagination when there are multiple pages", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    expect(
      screen.getByText("Affichage de 1 à 1 sur 2 résultats")
    ).toBeInTheDocument();
    expect(screen.getByText("Précédent")).toBeInTheDocument();
    expect(screen.getByText("Suivant")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should handle page navigation", async () => {
    const mockRefetch = vi.fn();
    mockUseAdminOffices.mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    const nextButton = screen.getByText("Suivant");
    fireEvent.click(nextButton);

    expect(mockUseAdminOffices).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      search: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("should render action links correctly", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockOfficesResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();

    const actionButtons = screen.getAllByRole("button", { name: "" });
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it("should handle empty results", async () => {
    mockUseAdminOffices.mockReturnValue({
      data: mockEmptyResponse,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    expect(screen.getByText("Bureaux (0)")).toBeInTheDocument();
    expect(screen.queryByText("Bureau Test 1")).not.toBeInTheDocument();
  });

  it("should reset page to 1 when sorting changes", async () => {
    const mockRefetch = vi.fn();
    mockUseAdminOffices.mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as any);

    render(<OfficeTable searchQuery="" />, { wrapper: createWrapper() });

    const nextButton = screen.getByText("Suivant");
    fireEvent.click(nextButton);

    expect(mockUseAdminOffices).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );

    mockUseAdminOffices.mockClear();

    const titleSortButton = screen.getByRole("button", { name: /nom/i });
    fireEvent.click(titleSortButton);

    expect(mockUseAdminOffices).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: undefined,
      sortBy: "title",
      sortOrder: "asc",
    });
  });
});
