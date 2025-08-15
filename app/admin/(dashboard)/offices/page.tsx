"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OfficeTable } from "@/components/admin/office-table";
import { BulkImportDialog } from "@/components/admin/bulk-import-dialog";
import { Plus, Search } from "lucide-react";

export default function OfficesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImportComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Bureaux
          </h1>
          <p className="text-gray-600">Créer, éditer et gérer vos bureaux</p>
        </div>
        <div className="flex gap-2">
          <BulkImportDialog onImportComplete={handleImportComplete} />
          <Link href="/admin/offices/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Bureau
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un bureau..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <OfficeTable key={refreshKey} searchQuery={searchQuery} />
    </div>
  );
}
