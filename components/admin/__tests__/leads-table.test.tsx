import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LeadsTable } from "../leads-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import * as adminLeadsHooks from "@/hooks/use-admin-leads";

const mockLeads = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+33123456789",
    status: "pending" as const,
    officeId: 1,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    office: {
      id: 1,
      title: "Test Office",
      slug: "test-office",
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+33987654321",
    status: "contacted" as const,
    officeId: 1,
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z",
    office: {
      id: 1,
      title: "Test Office",
      slug: "test-office",
    },
  },
];

const mockApiResponse = {
  leads: mockLeads,
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

const mockUseAdminLeads = vi.spyOn(adminLeadsHooks, "useAdminLeads");
const mockUseUpdateLeadStatus = vi.spyOn(
  adminLeadsHooks,
  "useUpdateLeadStatus"
);

beforeEach(() => {
  mockUseAdminLeads.mockReturnValue({
    data: mockApiResponse,
    isPending: false,
    error: null,
    isPlaceholderData: false,
    isFetching: false,
    refetch: vi.fn(),
  } as any);

  mockUseUpdateLeadStatus.mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  } as any);
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
      <Toaster />
    </QueryClientProvider>
  );
};

describe("LeadsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render leads table with data", () => {
    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("Leads (2)")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("should display lead contact information", () => {
    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+33123456789")).toBeInTheDocument();
  });

  it("should display office information", () => {
    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getAllByText("Test Office")).toHaveLength(2);
  });

  it("should display status badges", () => {
    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getAllByText("En attente")).toHaveLength(2);
    expect(screen.getAllByText("Contacté")).toHaveLength(2);
  });

  it("should display formatted dates", () => {
    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
    expect(screen.getByText("02/01/2024")).toBeInTheDocument();
  });

  it("should render sortable column headers", () => {
    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("should handle status updates", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({ success: true });
    mockUseUpdateLeadStatus.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);

    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    const statusSelect = screen.getAllByRole("combobox")[0];
    fireEvent.click(statusSelect);

    const contactedOption = screen.getByText("Contacté");
    fireEvent.click(contactedOption);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        leadId: 1,
        status: "contacted",
      });
    });
  });

  it("should show loading state", () => {
    mockUseAdminLeads.mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
      isPlaceholderData: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("Leads")).toBeInTheDocument();
  });

  it("should show error state", () => {
    mockUseAdminLeads.mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error("Failed to fetch"),
      isPlaceholderData: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("Erreur")).toBeInTheDocument();
    expect(
      screen.getByText("Impossible de charger les leads. Veuillez réessayer.")
    ).toBeInTheDocument();
  });

  it("should display pagination when there are multiple pages", () => {
    const mockDataWithPagination = {
      ...mockApiResponse,
      pagination: {
        ...mockApiResponse.pagination,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      },
    };

    mockUseAdminLeads.mockReturnValue({
      data: mockDataWithPagination,
      isPending: false,
      error: null,
      isPlaceholderData: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    expect(screen.getByText("Page 1 sur 3")).toBeInTheDocument();
    expect(screen.getByText("Suivant")).toBeInTheDocument();
  });

  it("should disable status select when update is pending", () => {
    mockUseUpdateLeadStatus.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    } as any);

    renderWithProviders(<LeadsTable searchQuery="" statusFilter="all" />);

    const statusSelects = screen.getAllByRole("combobox");
    statusSelects.forEach((select) => {
      expect(select).toBeDisabled();
    });
  });
});
