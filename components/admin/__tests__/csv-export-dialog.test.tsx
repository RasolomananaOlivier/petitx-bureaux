import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CSVExportDialog } from "../csv-export-dialog";
import { adminLeadsApi } from "@/lib/api/leads";

vi.mock("@/lib/api/leads");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockAdminLeadsApi = vi.mocked(adminLeadsApi);

describe("CSVExportDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render export button", () => {
    render(<CSVExportDialog />);
    expect(screen.getByText("Exporter CSV")).toBeInTheDocument();
  });

  it("should open dialog when button is clicked", () => {
    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    expect(screen.getByText("Exporter les leads en CSV")).toBeInTheDocument();
    expect(
      screen.getByText("Sélectionnez une période et recevez l'export par email")
    ).toBeInTheDocument();
  });

  it("should show form fields when dialog is open", () => {
    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    expect(screen.getByLabelText("Date de début")).toBeInTheDocument();
    expect(screen.getByLabelText("Date de fin")).toBeInTheDocument();
    expect(screen.getByText("Statut")).toBeInTheDocument();
    expect(screen.getByLabelText("Email de réception")).toBeInTheDocument();
  });

  it("should show validation errors for invalid form", async () => {
    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText("La date de début est requise")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La date de fin est requise")
      ).toBeInTheDocument();
      expect(screen.getByText("Email invalide")).toBeInTheDocument();
    });
  });

  it("should enable export button when form is valid", () => {
    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    expect(exportButton).not.toBeDisabled();
  });

  it("should show validation error when end date is before start date", async () => {
    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "La date de début doit être antérieure à la date de fin"
        )
      ).toBeInTheDocument();
    });
  });

  it("should call API and show success message on successful export", async () => {
    mockAdminLeadsApi.exportToCSV.mockResolvedValue({
      success: true,
      message: "Export CSV envoyé par email avec succès",
      leadCount: 5,
    });

    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockAdminLeadsApi.exportToCSV).toHaveBeenCalledWith({
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        status: "all",
        email: "test@example.com",
      });
    });
  });

  it("should show error message on API failure", async () => {
    mockAdminLeadsApi.exportToCSV.mockResolvedValue({
      success: false,
      message: "Erreur lors de l'export",
    });

    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockAdminLeadsApi.exportToCSV).toHaveBeenCalled();
    });
  });

  it("should close dialog after successful export", async () => {
    mockAdminLeadsApi.exportToCSV.mockResolvedValue({
      success: true,
      message: "Export CSV envoyé par email avec succès",
      leadCount: 5,
    });

    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Exporter les leads en CSV")
      ).not.toBeInTheDocument();
    });
  });

  it("should reset form after successful export", async () => {
    mockAdminLeadsApi.exportToCSV.mockResolvedValue({
      success: true,
      message: "Export CSV envoyé par email avec succès",
      leadCount: 5,
    });

    render(<CSVExportDialog />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      fireEvent.click(button);
      expect(screen.getByLabelText("Date de début")).toHaveValue("");
      expect(screen.getByLabelText("Date de fin")).toHaveValue("");
      expect(screen.getByLabelText("Email de réception")).toHaveValue("");
    });
  });

  it("should call onExportComplete callback after successful export", async () => {
    const onExportComplete = vi.fn();
    mockAdminLeadsApi.exportToCSV.mockResolvedValue({
      success: true,
      message: "Export CSV envoyé par email avec succès",
      leadCount: 5,
    });

    render(<CSVExportDialog onExportComplete={onExportComplete} />);

    const button = screen.getByText("Exporter CSV");
    fireEvent.click(button);

    const startDateInput = screen.getByLabelText("Date de début");
    const endDateInput = screen.getByLabelText("Date de fin");
    const emailInput = screen.getByLabelText("Email de réception");

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(onExportComplete).toHaveBeenCalled();
    });
  });
});
