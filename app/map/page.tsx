"use client";

import React, { useState } from "react";
import GoogleMap from "./google-map";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { List, Map as MapIcon } from "lucide-react";

// Dummy data for sidebar items
const items = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  title: `Bureau #${i + 1}`,
  description: "Bureau lumineux, 2-4 personnes, Paris centre",
}));

export default function Page() {
  // Mobile view: 'list' or 'map'
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  // Responsive: show map and sidebar together on md+, toggle on mobile
  return (
    <div className="relative min-h-screen bg-background">
      {/* Filter section */}
      <section className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <Input
          placeholder="Rechercher un bureau, une ville..."
          className="max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">Prix</Button>
          <Button variant="outline">Capacité</Button>
          <Button variant="outline">Équipements</Button>
          <Button variant="outline">Plus de filtres</Button>
        </div>
      </section>

      <div className="flex w-full h-[calc(100dvh-56px-56px)] md:h-[calc(100dvh-56px-64px)]">
        {/* Sidebar (list) */}
        <aside
          className={
            "bg-white border-r border-gray-100 overflow-y-auto transition-all duration-300 " +
            "w-full md:w-[420px] lg:w-[520px] shrink-0 " +
            (mobileView === "map" ? "hidden md:block" : "block")
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>

        {/* Map */}
        <main
          className={
            "flex-1 h-full transition-all duration-300 " +
            (mobileView === "list" ? "hidden md:block" : "block")
          }
        >
          <div className="w-full h-full">
            <GoogleMap />
          </div>
        </main>
      </div>

      {/* Floating action button for mobile view toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full shadow-lg px-6 py-3 text-base"
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
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
    </div>
  );
}
