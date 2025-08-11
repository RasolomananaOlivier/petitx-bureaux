"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, RotateCcw } from "lucide-react";

interface Service {
  id: number;
  name: string;
  icon: string | null;
}

interface ServiceCategory {
  name: string;
  services: Service[];
}

interface ServicesFilterProps {
  services: number[] | null;
  onServicesChange: (value: number[] | null) => void;
  onClear: () => void;
  onApply: () => void;
}

export function ServicesFilter({
  services,
  onServicesChange,
  onClear,
  onApply,
}: ServicesFilterProps) {
  const [availableServices, setAvailableServices] = useState<ServiceCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();

        const categorizedServices: ServiceCategory[] = [
          {
            name: "INTERNET",
            services: data.filter((service: Service) =>
              ["Wifi", "Réseau dédié", "Fibre"].includes(service.name)
            ),
          },
          {
            name: "CONFORT",
            services: data.filter((service: Service) =>
              ["Espace d'attente", "Espace détente", "Cuisine"].includes(
                service.name
              )
            ),
          },
        ];

        setAvailableServices(categorizedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceToggle = (serviceId: number) => {
    const currentServices = services || [];
    if (currentServices.includes(serviceId)) {
      onServicesChange(currentServices.filter((id) => id !== serviceId));
    } else {
      onServicesChange([...currentServices, serviceId]);
    }
  };

  if (loading) {
    return <div className="p-4">Chargement des services...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Services Inclus</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="space-y-2 pl-4">
            {availableServices.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="font-medium text-sm">{category.name}</div>
                <div className="flex flex-wrap gap-2">
                  {category.services.map((service) => (
                    <Button
                      key={service.id}
                      size="sm"
                      variant="outline"
                      onClick={() => handleServiceToggle(service.id)}
                      className={
                        services?.includes(service.id)
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : ""
                      }
                    >
                      {services?.includes(service.id) && (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      {service.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700">
          Appliquer
        </Button>
      </div>
    </div>
  );
}
