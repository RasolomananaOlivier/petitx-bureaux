"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  MessageSquare,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAdminLeads, useUpdateLeadStatus } from "@/hooks/use-admin-leads";
import type { AdminLeadFilters } from "@/lib/api/admin-leads";
import { toast } from "sonner";

interface LeadsTableProps {
  searchQuery: string;
  statusFilter: string;
}

type SortField = "createdAt" | "updatedAt" | "name" | "email";
type SortOrder = "asc" | "desc";

const statusColors = {
  pending: "destructive",
  contacted: "default",
  converted: "secondary",
  rejected: "outline",
} as const;

const statusLabels = {
  pending: "En attente",
  contacted: "Contacté",
  converted: "Converti",
  rejected: "Rejeté",
} as const;

const SortButton = ({
  children,
  field,
  currentField,
  currentOrder,
  onSort,
}: {
  children: React.ReactNode;
  field: SortField;
  currentField: SortField;
  currentOrder: SortOrder;
  onSort: (field: SortField) => void;
}) => (
  <Button
    variant="ghost"
    onClick={() => onSort(field)}
    className="h-auto p-0 font-medium hover:bg-transparent"
  >
    {children}
    {currentField === field &&
      (currentOrder === "asc" ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4" />
      ))}
  </Button>
);

export function LeadsTable({ searchQuery, statusFilter }: LeadsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filters: AdminLeadFilters = {
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as any),
    sortBy: sortField,
    sortOrder: sortOrder,
  };

  const { data, isPending, error, isPlaceholderData, isFetching, refetch } =
    useAdminLeads({ ...filters });

  const updateLeadStatusMutation = useUpdateLeadStatus();

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusUpdate = async (leadId: number, newStatus: string) => {
    try {
      await updateLeadStatusMutation.mutateAsync({ leadId, status: newStatus });
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>
            Liste des demandes clients et leur statut de suivi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>
            Impossible de charger les leads. Veuillez réessayer.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads ({data.pagination.total})</CardTitle>
        <CardDescription>
          Liste des demandes clients et leur statut de suivi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton
                  field="name"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                >
                  Contact
                </SortButton>
              </TableHead>
              <TableHead>Bureau</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Email vérifié</TableHead>
              <TableHead>
                <SortButton
                  field="createdAt"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                >
                  Date
                </SortButton>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {lead.office?.title || `Bureau #${lead.officeId}`}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[lead.status]}>
                    {statusLabels[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={lead.emailVerifiedAt ? "default" : "secondary"}
                  >
                    {lead.emailVerifiedAt ? "Vérifié" : "Non vérifié"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(lead.createdAt)}</div>
                    <div className="text-muted-foreground">
                      {formatTime(lead.createdAt)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(lead.id, value)
                    }
                    disabled={updateLeadStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="converted">Converti</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de{" "}
              {(data.pagination.page - 1) * data.pagination.limit + 1} à{" "}
              {Math.min(
                data.pagination.page * data.pagination.limit,
                data.pagination.total
              )}{" "}
              sur {data.pagination.total} résultats
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={!data.pagination.hasPrev}
              >
                Précédent
              </Button>
              <span className="text-sm">
                Page {data.pagination.page} sur {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={!data.pagination.hasNext}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
