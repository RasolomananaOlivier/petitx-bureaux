import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPICards } from "../kpi-cards";

const mockKPIs = {
  totalOffices: 150,
  publishedOffices: 120,
  draftOffices: 30,
  leadsThisMonth: 45,
  leadsChangePercent: 12.5,
  conversionRate: 8.2,
  activeAccounts: 25,
  adminAccounts: 3,
  editorAccounts: 22,
};

describe("KPICards", () => {
  it("renders all KPI cards with correct data", () => {
    render(<KPICards kpis={mockKPIs} />);

    expect(screen.getByText("Total Bureaux")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("120 publiés")).toBeInTheDocument();
    expect(screen.getByText("30 brouillons")).toBeInTheDocument();

    expect(screen.getByText("Leads ce mois")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("+12.5% vs mois dernier")).toBeInTheDocument();

    expect(screen.getByText("Taux de conversion")).toBeInTheDocument();
    expect(screen.getByText("8.2%")).toBeInTheDocument();

    expect(screen.getByText("Comptes actifs")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("3 admins")).toBeInTheDocument();
    expect(screen.getByText("22 éditeurs")).toBeInTheDocument();
  });

  it("handles zero values correctly", () => {
    const zeroKPIs = {
      totalOffices: 0,
      publishedOffices: 0,
      draftOffices: 0,
      leadsThisMonth: 0,
      leadsChangePercent: 0,
      conversionRate: 0,
      activeAccounts: 0,
      adminAccounts: 0,
      editorAccounts: 0,
    };

    render(<KPICards kpis={zeroKPIs} />);

    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(screen.getByText("0 publiés")).toBeInTheDocument();
    expect(screen.getByText("0 brouillons")).toBeInTheDocument();
    expect(screen.getByText("0 admins")).toBeInTheDocument();
    expect(screen.getByText("0 éditeurs")).toBeInTheDocument();
  });

  it("handles negative change percentage", () => {
    const negativeKPIs = {
      ...mockKPIs,
      leadsChangePercent: -5.2,
    };

    render(<KPICards kpis={negativeKPIs} />);

    expect(screen.getByText("-5.2% vs mois dernier")).toBeInTheDocument();
  });
});
