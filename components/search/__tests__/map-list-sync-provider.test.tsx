import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MapListSyncProvider, useMapListSync } from "../map-list-sync-provider";
import { OfficeWithRelations } from "@/features/offices/types";

const mockOffice: OfficeWithRelations = {
  id: 1,
  title: "Test Office",
  description: "Test Description",
  slug: "test-office",
  arr: 1,
  priceCents: 100000,
  nbPosts: 5,
  lat: 48.8566,
  lng: 2.3522,
  isFake: false,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  photos: [],
  officeServices: [],
};

function TestComponent() {
  const {
    selectedOfficeId,
    hoveredOfficeId,
    filteredOffices,
    setSelectedOfficeId,
    setHoveredOfficeId,
    setFilteredOffices,
  } = useMapListSync();

  return (
    <div>
      <div data-testid="selected-office">{selectedOfficeId}</div>
      <div data-testid="hovered-office">{hoveredOfficeId}</div>
      <div data-testid="filtered-offices-count">{filteredOffices.length}</div>
      <button
        data-testid="select-office"
        onClick={() => setSelectedOfficeId(1)}
      >
        Select Office
      </button>
      <button data-testid="hover-office" onClick={() => setHoveredOfficeId(1)}>
        Hover Office
      </button>
      <button
        data-testid="set-offices"
        onClick={() => setFilteredOffices([mockOffice])}
      >
        Set Offices
      </button>
    </div>
  );
}

describe("MapListSyncProvider", () => {
  it("provides initial state", () => {
    render(
      <MapListSyncProvider>
        <TestComponent />
      </MapListSyncProvider>
    );

    expect(screen.getByTestId("selected-office")).toHaveTextContent("");
    expect(screen.getByTestId("hovered-office")).toHaveTextContent("");
    expect(screen.getByTestId("filtered-offices-count")).toHaveTextContent("0");
  });

  it("updates selected office", () => {
    render(
      <MapListSyncProvider>
        <TestComponent />
      </MapListSyncProvider>
    );

    fireEvent.click(screen.getByTestId("select-office"));
    expect(screen.getByTestId("selected-office")).toHaveTextContent("1");
  });

  it("updates hovered office", () => {
    render(
      <MapListSyncProvider>
        <TestComponent />
      </MapListSyncProvider>
    );

    fireEvent.click(screen.getByTestId("hover-office"));
    expect(screen.getByTestId("hovered-office")).toHaveTextContent("1");
  });

  it("updates filtered offices", () => {
    render(
      <MapListSyncProvider>
        <TestComponent />
      </MapListSyncProvider>
    );

    fireEvent.click(screen.getByTestId("set-offices"));
    expect(screen.getByTestId("filtered-offices-count")).toHaveTextContent("1");
  });
});
