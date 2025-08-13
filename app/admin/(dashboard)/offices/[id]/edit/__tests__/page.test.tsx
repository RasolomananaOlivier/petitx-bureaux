import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import EditOfficePage from "../page";
import { useAdminOffice } from "@/hooks/use-admin-offices";
import { useOfficeFormStore } from "@/lib/store/office-store";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("@/hooks/use-admin-offices", () => ({
  useAdminOffice: vi.fn(),
}));

vi.mock("@/lib/store/office-store", () => ({
  useOfficeFormStore: vi.fn(),
}));

vi.mock("@/components/admin/office-stepper-form", () => ({
  default: ({ mode, officeId }: { mode: string; officeId: number }) => (
    <div data-testid="office-stepper-form">
      Mode: {mode}, Office ID: {officeId}
    </div>
  ),
}));

describe("EditOfficePage", () => {
  const mockRouter = {
    back: vi.fn(),
  };

  const mockUpdateFormData = vi.fn();
  const mockResetForm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useOfficeFormStore).mockReturnValue({
      updateFormData: mockUpdateFormData,
      resetForm: mockResetForm,
    } as any);
  });

  it("should render loading state", () => {
    vi.mocked(useAdminOffice).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<EditOfficePage />);

    expect(screen.getByText("Modifier le bureau")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render error state", () => {
    vi.mocked(useAdminOffice).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Test error"),
    } as any);

    render(<EditOfficePage />);

    expect(screen.getByText("Erreur")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByText("Retour")).toBeInTheDocument();
  });

  it("should render not found state", () => {
    vi.mocked(useAdminOffice).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    render(<EditOfficePage />);

    expect(screen.getByText("Bureau non trouvé")).toBeInTheDocument();
    expect(
      screen.getByText("Le bureau demandé n'existe pas.")
    ).toBeInTheDocument();
    expect(screen.getByText("Retour")).toBeInTheDocument();
  });

  it("should render edit form with office data", async () => {
    const mockOffice = {
      id: 1,
      title: "Test Office",
      description: "Test Description",
      slug: "test-office",
      arr: 1,
      priceCents: 10000,
      nbPosts: 5,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      officeServices: [
        { service: { id: 1, name: "WiFi" } },
        { service: { id: 2, name: "Coffee" } },
      ],
    };

    vi.mocked(useAdminOffice).mockReturnValue({
      data: mockOffice,
      isLoading: false,
      error: null,
    } as any);

    render(<EditOfficePage />);

    await waitFor(() => {
      expect(screen.getByText("Modifier le bureau")).toBeInTheDocument();
      expect(
        screen.getByText('Modifiez les informations du bureau "Test Office"')
      ).toBeInTheDocument();
      expect(screen.getByTestId("office-stepper-form")).toBeInTheDocument();
    });

    expect(mockUpdateFormData).toHaveBeenCalledWith({
      title: "Test Office",
      description: "Test Description",
      arr: 1,
      priceCents: 10000,
      nbPosts: 5,
      isFake: false,
      slug: "test-office",
      lat: 48.8566,
      lng: 2.3522,
      amenities: ["WiFi", "Coffee"],
      photos: [],
    });
  });

  it("should handle back button click", () => {
    vi.mocked(useAdminOffice).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    render(<EditOfficePage />);

    const backButton = screen.getByText("Retour");
    backButton.click();

    expect(mockRouter.back).toHaveBeenCalled();
  });
});
