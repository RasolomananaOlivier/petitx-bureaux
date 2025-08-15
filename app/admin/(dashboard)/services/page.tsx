"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { toast } from "sonner";

interface Service {
  id: number;
  name: string;
  icon: string | null;
  createdAt: string;
}

export default function ServicesPage() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newService, setNewService] = useState({ name: "", icon: "" });
  const [editingService, setEditingService] = useState({ name: "", icon: "" });
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/api/services");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (service: { name: string; icon: string }) => {
      const response = await api.post("/api/services", service);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setNewService({ name: "", icon: "" });
      toast.success("Service créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du service");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      service,
    }: {
      id: number;
      service: { name: string; icon: string };
    }) => {
      const response = await api.put(`/api/services/${id}`, service);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setEditingId(null);
      setEditingService({ name: "", icon: "" });
      toast.success("Service modifié avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la modification du service");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du service");
    },
  });

  const handleCreate = () => {
    if (newService.name.trim()) {
      createMutation.mutate(newService);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setEditingService({ name: service.name, icon: service.icon || "" });
  };

  const handleUpdate = () => {
    if (editingId && editingService.name.trim()) {
      updateMutation.mutate({ id: editingId, service: editingService });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingService({ name: "", icon: "" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des services
          </h1>
          <p className="text-gray-600">
            Gérez les services disponibles pour les bureaux
          </p>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des services
        </h1>
        <p className="text-gray-600">
          Gérez les services disponibles pour les bureaux
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un nouveau service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="new-name">Nom du service</Label>
              <Input
                id="new-name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder="Ex: WiFi, Parking, Salle de réunion..."
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="new-icon">Icône (optionnel)</Label>
              <Input
                id="new-icon"
                value={newService.icon}
                onChange={(e) =>
                  setNewService({ ...newService, icon: e.target.value })
                }
                placeholder="Ex: wifi, car, users..."
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCreate}
                disabled={!newService.name.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? "Création..." : "Ajouter"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Services existants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services?.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                {editingId === service.id ? (
                  <div className="flex gap-4 flex-1">
                    <div className="flex-1">
                      <Input
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={editingService.icon}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            icon: e.target.value,
                          })
                        }
                        placeholder="Icône (optionnel)"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        "Sauvegarde..."
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{service.name}</span>
                      {service.icon && (
                        <Badge variant="outline">{service.icon}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(service.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {services?.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Aucun service configuré
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
