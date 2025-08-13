"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { getAdminOffices } from "@/lib/api/admin-offices";
import type { AdminOfficeFilters } from "@/lib/types";
import type { PaginatedOfficesResponse } from "@/features/offices/types";

interface OfficeTableProps {
  searchQuery: string;
}

type SortField = "title" | "createdAt" | "updatedAt" | "priceCents";
type SortOrder = "asc" | "desc";

export function OfficeTable({ searchQuery }: OfficeTableProps) {
  const [data, setData] = useState<PaginatedOfficesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchOffices = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: AdminOfficeFilters = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy: sortField,
        sortOrder: sortOrder,
      };

      const response = await getAdminOffices(filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch offices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, [currentPage, sortField, sortOrder, searchQuery]);

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

  const formatPrice = (priceCents: number) => {
    return `${(priceCents / 100).toFixed(2)}€`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        ))}
    </Button>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bureaux</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
              data-testid="loading-spinner"
            ></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bureaux</CardTitle>
          <CardDescription>Erreur lors du chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-8">
            {error}
            <br />
            <Button onClick={() => fetchOffices()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bureaux ({data.pagination.total})</CardTitle>
        <CardDescription>
          Liste de tous les bureaux référencés sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="title">Nom</SortButton>
              </TableHead>
              <TableHead>Arrondissement</TableHead>
              <TableHead>
                <SortButton field="priceCents">Prix</SortButton>
              </TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <SortButton field="createdAt">Créé le</SortButton>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.offices.map((office) => (
              <TableRow key={office.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{office.title}</div>
                    {office.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {office.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{office.arr}ème</TableCell>
                <TableCell>{formatPrice(office.priceCents)}</TableCell>
                <TableCell>{office.nbPosts || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={office.publishedAt ? "default" : "secondary"}>
                    {office.publishedAt ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={office.isFake ? "destructive" : "outline"}>
                    {office.isFake ? "Factice" : "Réel"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(office.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/offices/${office.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir (Admin)
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${office.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir (Public)
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/offices/${office.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Éditer
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
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
              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: data.pagination.totalPages },
                  (_, i) => i + 1
                )
                  .filter((page) => {
                    const current = data.pagination.page;
                    return (
                      page === 1 ||
                      page === data.pagination.totalPages ||
                      (page >= current - 1 && page <= current + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-1">...</span>
                      )}
                      <Button
                        variant={
                          page === data.pagination.page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>
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
