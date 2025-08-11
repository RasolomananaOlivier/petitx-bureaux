"use client";

import { Button } from "@/components/ui/button";
import { List, Map as MapIcon } from "lucide-react";

interface MobileViewToggleProps {
  mobileView: "list" | "map";
  onToggle: () => void;
}

export function MobileViewToggle({
  mobileView,
  onToggle,
}: MobileViewToggleProps) {
  return (
    <div className="md:hidden fixed bottom-6 right-6 z-40">
      <Button
        size="lg"
        className="rounded-full shadow-lg px-6 py-3 text-base"
        onClick={onToggle}
      >
        {mobileView === "list" ? (
          <>
            <MapIcon className="mr-2" /> Voir la carte
          </>
        ) : (
          <>
            <List className="mr-2" /> Voir la liste
          </>
        )}
      </Button>
    </div>
  );
}
