import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeleteOfficeDialog } from "../delete-office-dialog";
import { useDeleteOffice } from "@/hooks/use-delete-office";

vi.mock("@/hooks/use-delete-office", () => ({
  useDeleteOffice: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "TestWrapper";

  return Wrapper;
}

describe("DeleteOfficeDialog", () => {
  const mockDeleteOffice = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteOffice).mockReturnValue({
      mutateAsync: mockDeleteOffice,
      isPending: false,
    } as any);
  });

  it("should render delete button", () => {
    render(<DeleteOfficeDialog officeId={1} officeTitle="Test Office" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Supprimer")).toBeInTheDocument();
  });

  it("should open dialog when delete button is clicked", () => {
    render(<DeleteOfficeDialog officeId={1} officeTitle="Test Office" />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByText("Supprimer"));

    expect(screen.getByText("Supprimer le bureau")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Êtes-vous sûr de vouloir supprimer le bureau "Test Office"/
      )
    ).toBeInTheDocument();
  });

  it("should close dialog when cancel is clicked", async () => {
    render(<DeleteOfficeDialog officeId={1} officeTitle="Test Office" />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByText("Supprimer"));
    fireEvent.click(screen.getByText("Annuler"));

    await waitFor(() => {
      expect(screen.queryByText("Supprimer le bureau")).not.toBeInTheDocument();
    });
  });

  it("should call delete function when confirm is clicked", async () => {
    mockDeleteOffice.mockResolvedValue(undefined);

    render(<DeleteOfficeDialog officeId={1} officeTitle="Test Office" />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByText("Supprimer"));
    const confirmButton = screen.getByRole("button", { name: "Supprimer" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteOffice).toHaveBeenCalledWith(1);
    });
  });

  it("should show loading state during deletion", () => {
    vi.mocked(useDeleteOffice).mockReturnValue({
      mutateAsync: mockDeleteOffice,
      isPending: true,
    } as any);

    render(<DeleteOfficeDialog officeId={1} officeTitle="Test Office" />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByText("Supprimer"));

    expect(screen.getByText("Suppression...")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeDisabled();
  });

  it("should render custom trigger", () => {
    const customTrigger = <button>Custom Delete</button>;

    render(
      <DeleteOfficeDialog
        officeId={1}
        officeTitle="Test Office"
        trigger={customTrigger}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Custom Delete")).toBeInTheDocument();
  });
});
