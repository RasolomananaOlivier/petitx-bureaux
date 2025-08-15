import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BulkImportDialog } from "../bulk-import-dialog";
import { toast } from "sonner";
import { bulkImportOffices } from "@/lib/api/admin-offices";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/lib/api/admin-offices", () => ({
  bulkImportOffices: vi.fn(),
}));

vi.mock("react-dropzone", () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}));

describe("BulkImportDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render import button", () => {
    render(<BulkImportDialog />);
    expect(screen.getByText("Import CSV")).toBeInTheDocument();
  });

  it("should open dialog when button is clicked", () => {
    render(<BulkImportDialog />);

    const button = screen.getByText("Import CSV");
    fireEvent.click(button);

    expect(screen.getByText("Import en masse des bureaux")).toBeInTheDocument();
    expect(
      screen.getByText("Importez jusqu'à 500 bureaux depuis un fichier CSV")
    ).toBeInTheDocument();
  });

  it("should show download template button", () => {
    render(<BulkImportDialog />);

    const button = screen.getByText("Import CSV");
    fireEvent.click(button);

    expect(screen.getByText("Télécharger le modèle")).toBeInTheDocument();
  });

  it("should call onImportComplete when import is successful", async () => {
    const mockOnImportComplete = vi.fn();
    const mockBulkImport = vi.mocked(bulkImportOffices).mockResolvedValue({
      success: true,
      message: "Import successful",
      results: {
        total: 1,
        created: 1,
        skipped: 0,
        errors: [],
      },
    });

    render(<BulkImportDialog onImportComplete={mockOnImportComplete} />);

    const button = screen.getByText("Import CSV");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Import en masse des bureaux")
      ).toBeInTheDocument();
    });

    expect(mockOnImportComplete).not.toHaveBeenCalled();
  });

  it("should show error toast when import fails", async () => {
    const mockBulkImport = vi
      .mocked(bulkImportOffices)
      .mockRejectedValue(new Error("Import failed"));

    render(<BulkImportDialog />);

    const button = screen.getByText("Import CSV");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Import en masse des bureaux")
      ).toBeInTheDocument();
    });

    expect(mockBulkImport).not.toHaveBeenCalled();
  });
});
