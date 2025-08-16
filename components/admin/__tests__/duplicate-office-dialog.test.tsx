import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DuplicateOfficeDialog } from "../duplicate-office-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const mockMutateAsync = vi.fn();

vi.mock("@/hooks/use-duplicate-office", () => ({
  useDuplicateOffice: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
      <Toaster />
    </QueryClientProvider>
  );
};

describe("DuplicateOfficeDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAsync.mockResolvedValue({
      id: 2,
      title: "Test Office (2)",
      slug: "test-office-2",
    });
  });

  it("should render duplicate button", () => {
    renderWithProviders(
      <DuplicateOfficeDialog officeId={1} officeTitle="Test Office" />
    );

    expect(screen.getByText("Dupliquer")).toBeInTheDocument();
  });

  it("should open dialog when button is clicked", () => {
    renderWithProviders(
      <DuplicateOfficeDialog officeId={1} officeTitle="Test Office" />
    );

    fireEvent.click(screen.getByText("Dupliquer"));

    expect(screen.getByText("Dupliquer le bureau")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Êtes-vous sûr de vouloir dupliquer le bureau "Test Office"/
      )
    ).toBeInTheDocument();
  });

  it("should close dialog when cancel is clicked", async () => {
    renderWithProviders(
      <DuplicateOfficeDialog officeId={1} officeTitle="Test Office" />
    );

    fireEvent.click(screen.getByText("Dupliquer"));
    fireEvent.click(screen.getByText("Annuler"));

    await waitFor(() => {
      expect(screen.queryByText("Dupliquer le bureau")).not.toBeInTheDocument();
    });
  });

  it("should call duplicate function when confirm is clicked", async () => {
    renderWithProviders(
      <DuplicateOfficeDialog officeId={1} officeTitle="Test Office" />
    );

    fireEvent.click(screen.getByText("Dupliquer"));

    const confirmButtons = screen.getAllByText("Dupliquer");
    const confirmButton = confirmButtons[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(1);
    });
  });
});
