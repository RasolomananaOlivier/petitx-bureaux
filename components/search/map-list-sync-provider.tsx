"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { OfficeWithRelations } from "@/features/offices/types";

interface MapListSyncContextType {
  selectedOfficeId: number | null;
  hoveredOfficeId: number | null;
  expandedOfficeId: number | null;
  filteredOffices: OfficeWithRelations[];
  setSelectedOfficeId: (id: number | null) => void;
  setHoveredOfficeId: (id: number | null) => void;
  setExpandedOfficeId: (id: number | null) => void;
  setFilteredOffices: (offices: OfficeWithRelations[]) => void;
}

const MapListSyncContext = createContext<MapListSyncContextType | undefined>(
  undefined
);

export function useMapListSync() {
  const context = useContext(MapListSyncContext);
  if (!context) {
    throw new Error("useMapListSync must be used within a MapListSyncProvider");
  }
  return context;
}

interface MapListSyncProviderProps {
  children: ReactNode;
}

export function MapListSyncProvider({ children }: MapListSyncProviderProps) {
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null);
  const [hoveredOfficeId, setHoveredOfficeId] = useState<number | null>(null);
  const [expandedOfficeId, setExpandedOfficeId] = useState<number | null>(null);
  const [filteredOffices, setFilteredOffices] = useState<OfficeWithRelations[]>(
    []
  );

  const value: MapListSyncContextType = {
    selectedOfficeId,
    hoveredOfficeId,
    expandedOfficeId,
    filteredOffices,
    setSelectedOfficeId,
    setHoveredOfficeId,
    setExpandedOfficeId,
    setFilteredOffices,
  };

  return (
    <MapListSyncContext.Provider value={value}>
      {children}
    </MapListSyncContext.Provider>
  );
}
