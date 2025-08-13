import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OfficeTable } from "../office-table";
import * as adminOfficesApi from "@/lib/api/admin-offices";
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

vi.mock("@/lib/api/admin-offices");

describe("OfficeTable", () => {
  const mockGetAdminOffices = vi.mocked(adminOfficesApi.getAdminOffices);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", async () => {
    mockGetAdminOffices.mockImplementation(() => new Promise(() => {}));

    render(<OfficeTable searchQuery="" />);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render offices table with data", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
      expect(screen.getByText("Bureau Test 2")).toBeInTheDocument();
    });

    expect(screen.getByText("Bureaux (2)")).toBeInTheDocument();
    expect(screen.getByText("50.00€")).toBeInTheDocument();
    expect(screen.getByText("75.00€")).toBeInTheDocument();
    expect(screen.getByText("1ème")).toBeInTheDocument();
    expect(screen.getByText("2ème")).toBeInTheDocument();
  });

  it("should display published and draft status correctly", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Publié")).toBeInTheDocument();
      expect(screen.getByText("Brouillon")).toBeInTheDocument();
    });
  });

  it("should display fake and real office types correctly", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Réel")).toBeInTheDocument();
      expect(screen.getByText("Factice")).toBeInTheDocument();
    });
  });

  it("should handle API error gracefully", async () => {
    mockGetAdminOffices.mockRejectedValue(new Error("API Error"));

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
      expect(screen.getByText("Réessayer")).toBeInTheDocument();
    });
  });

  it("should retry loading on error button click", async () => {
    mockGetAdminOffices
      .mockRejectedValueOnce(new Error("API Error"))
      .mockResolvedValueOnce(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Réessayer")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Réessayer"));

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    expect(mockGetAdminOffices).toHaveBeenCalledTimes(2);
  });

  it("should call API with search query", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="test search" />);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: "test search",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    });
  });

  it("should call API without search when query is empty", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    });
  });

  it("should handle sorting by title", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    const titleSortButton = screen.getByRole("button", { name: /nom/i });
    fireEvent.click(titleSortButton);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        sortBy: "title",
        sortOrder: "asc",
      });
    });
  });

  it("should toggle sort order when clicking same field", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    const createdAtSortButton = screen.getByRole("button", {
      name: /créé le/i,
    });

    fireEvent.click(createdAtSortButton);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        sortBy: "createdAt",
        sortOrder: "asc",
      });
    });
  });

  it("should render pagination when there are multiple pages", async () => {
    mockGetAdminOffices.mockResolvedValue(mockPaginatedResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Affichage de 1 à 1 sur 2 résultats")
    ).toBeInTheDocument();
    expect(screen.getByText("Précédent")).toBeInTheDocument();
    expect(screen.getByText("Suivant")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should handle page navigation", async () => {
    mockGetAdminOffices.mockResolvedValue(mockPaginatedResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Suivant");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        search: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    });
  });

  it("should render action links correctly", async () => {
    mockGetAdminOffices.mockResolvedValue(mockOfficesResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    const actionButtons = screen.getAllByRole("button", { name: "" });
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it("should handle empty results", async () => {
    mockGetAdminOffices.mockResolvedValue(mockEmptyResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureaux (0)")).toBeInTheDocument();
    });

    expect(screen.queryByText("Bureau Test 1")).not.toBeInTheDocument();
  });

  it("should reset page to 1 when sorting changes", async () => {
    mockGetAdminOffices.mockResolvedValue(mockPaginatedResponse);

    render(<OfficeTable searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("Bureau Test 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Suivant");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });

    mockGetAdminOffices.mockClear();

    const titleSortButton = screen.getByRole("button", { name: /nom/i });
    fireEvent.click(titleSortButton);

    await waitFor(() => {
      expect(mockGetAdminOffices).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        sortBy: "title",
        sortOrder: "asc",
      });
    });
  });
});
