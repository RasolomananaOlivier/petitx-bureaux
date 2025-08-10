"use client";

import React, { useState, useEffect, useCallback } from "react";
import GoogleMap from "./google-map";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  List,
  Map as MapIcon,
  Filter,
  X,
  Search,
  ChevronDown,
  MapPin,
  Users,
  Building,
  DollarSign,
  Ruler,
  Bell,
  Eye,
  Heart,
  Info,
  RotateCcw,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { OfficeWithRelations, PaginatedOfficesResponse } from "@/lib/types";
import { getOffices, GetOfficesParams } from "@/lib/api/offices";
import { Pagination } from "@/components/ui/pagination";
import { OfficeCard } from "@/components/sections/latest-office-section";

interface Service {
  id: number;
  name: string;
  icon: string | null;
}

export default function SearchPage() {
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [offices, setOffices] = useState<OfficeWithRelations[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState<GetOfficesParams>({
    page: 1,
    limit: 12,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  const [surfaceRange, setSurfaceRange] = useState([0, 1500]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  const fetchOffices = useCallback(async (params: GetOfficesParams) => {
    setLoading(true);
    try {
      const data = await getOffices(params);
      setOffices(data.offices);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching offices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchOffices(filters);
  }, [filters, fetchOffices]);

  const handleFilterChange = (key: keyof GetOfficesParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
    setSearchTerm("");
    setActiveFilter(null);
    setBudgetRange([0, 100000]);
    setSurfaceRange([0, 1500]);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      key !== "page" &&
      key !== "limit" &&
      filters[key as keyof GetOfficesParams]
  );

  const filterButtons = [
    {
      id: "location",
      label: "Localisation",
      icon: MapPin,
      active: activeFilter === "location",
    },
    {
      id: "posts",
      label: "Nombre de postes",
      icon: Users,
      active: activeFilter === "posts",
    },
    {
      id: "type",
      label: "Type de bureaux",
      icon: Building,
      active: activeFilter === "type",
    },
    {
      id: "budget",
      label: "Budget",
      icon: DollarSign,
      active: activeFilter === "budget",
    },
    {
      id: "surface",
      label: "Surface",
      icon: Ruler,
      active: activeFilter === "surface",
    },
    {
      id: "filters",
      label: "Filtres",
      icon: Filter,
      active: activeFilter === "filters",
    },
  ];

  const renderFilterContent = (filterId: string) => {
    switch (filterId) {
      case "location":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="paris" />
                <Label htmlFor="paris">Paris</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="lyon" />
                <Label htmlFor="lyon">Lyon</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="marseille" />
                <Label htmlFor="marseille">Marseille</Label>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {pagination.total} résultats
              </Button>
            </div>
          </div>
        );

      case "posts":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Min</Label>
                <Input placeholder="1 postes" />
              </div>
              <div className="space-y-2">
                <Label>Max</Label>
                <Input placeholder="500+ postes" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {pagination.total} résultats
              </Button>
            </div>
          </div>
        );

      case "type":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="independent" />
                <Label
                  htmlFor="independent"
                  className="flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-gray-600" />
                  Espace indépendant
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="private" />
                <Label htmlFor="private" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-600" />
                  Bureau privé pour votre équipe
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="shared" />
                <Label htmlFor="shared" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4 text-gray-600" />
                  Open space partagé
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="combinations" />
                <Label htmlFor="combinations" className="text-sm">
                  Voir les combinaisons de bureaux
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Annonces groupées en 1 résultat unique : votre équipe est
                répartie dans plusieurs bureaux d'un même lieu.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {pagination.total} résultats
              </Button>
            </div>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <Slider
                value={budgetRange}
                onValueChange={setBudgetRange}
                max={100000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100,000+</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Min</Label>
                <Input placeholder="0 € HT/mois" />
              </div>
              <div className="space-y-2">
                <Label>Max</Label>
                <Input placeholder="100 000+ € HT/mois" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {pagination.total} résultats
              </Button>
            </div>
          </div>
        );

      case "surface":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <Slider
                value={surfaceRange}
                onValueChange={setSurfaceRange}
                max={1500}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100</span>
                <span>500</span>
                <span>1500+</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Min</Label>
                <Input placeholder="0 m²" />
              </div>
              <div className="space-y-2">
                <Label>Max</Label>
                <Input placeholder="1500+ m²" />
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
              <ArrowRight className="h-4 w-4" />
              Calculer la surface qui correspond à mes effectifs et mes besoins
            </Button>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {pagination.total} résultats
              </Button>
            </div>
          </div>
        );

      case "filters":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Services Inclus</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2 pl-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">INTERNET</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Wifi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Réseau dédié
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Fibre
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">CONFORT</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Espace d'attente
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Espace détente
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Cuisine
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {pagination.total} résultats
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col bg-background">
      <section className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Annonces {(pagination.page - 1) * pagination.limit + 1} à{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </div>
            <div className="flex items-center gap-2">
              {filterButtons.map((button) => (
                <Popover
                  key={button.id}
                  open={activeFilter === button.id}
                  onOpenChange={(open) =>
                    setActiveFilter(open ? button.id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant={button.active ? "default" : "outline"}
                      size="sm"
                      className={`h-9 px-3 gap-2 ${
                        button.active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <button.icon className="h-4 w-4" />
                      {button.label}
                      {button.id === "type" && (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-6" align="start">
                    {renderFilterContent(button.id)}
                  </PopoverContent>
                </Popover>
              ))}
              <Select>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="Tri : Recommandations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommendations">
                    Tri : Recommandations
                  </SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={
            "bg-white border-r border-gray-100 flex flex-col " +
            "w-full md:w-[520px] lg:w-[620px] shrink-0 " +
            (mobileView === "map" ? "hidden md:flex" : "flex")
          }
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="p-4 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 grid grid-cols-2 gap-4">
                {offices.map((office, index) => (
                  <OfficeCard key={index} office={office} />
                ))}

                {pagination.totalPages > 1 && (
                  <div className="col-span-2 mt-6">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {activeFilter && (
          <div
            className="absolute inset-0 bg-black/20 z-40"
            onClick={() => setActiveFilter(null)}
          />
        )}

        <main
          className={
            "flex-1 h-full " +
            (mobileView === "list" ? "hidden md:block" : "block")
          }
        >
          <div className="w-full h-full">
            <GoogleMap />
          </div>
        </main>
      </div>

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
