"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Edit,
  Eye,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useAdminOffices } from "@/hooks/use-admin-offices";
import { DeleteOfficeDialog } from "@/components/admin/delete-office-dialog";
import type { AdminOfficeFilters } from "@/lib/types";
import { OfficeWithRelations } from "@/features/offices/types";

interface OfficeTableProps {
  searchQuery: string;
}

type SortField = "title" | "createdAt" | "updatedAt" | "priceCents";
type SortOrder = "asc" | "desc";

export function OfficeTable({ searchQuery }: OfficeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filters: AdminOfficeFilters = {
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    sortBy: sortField,
    sortOrder: sortOrder,
  };

  const { data, isPending, error, isPlaceholderData, isFetching, refetch } =
    useAdminOffices(filters);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bureaux</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full space-y-4">
            <div className="grid grid-cols-8 gap-4 w-full">
              <Skeleton
                className="h-4 w-full col-span-2"
                data-testid="skeleton"
              />
              <Skeleton className="h-4 w-full" data-testid="skeleton" />
              <Skeleton className="h-4 w-full" data-testid="skeleton" />
              <Skeleton className="h-4 w-full" data-testid="skeleton" />
              <Skeleton className="h-4 w-full" data-testid="skeleton" />
              <Skeleton className="h-4 w-full" data-testid="skeleton" />
              <Skeleton className="h-4 w-full" data-testid="skeleton" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4 w-full">
                <Skeleton
                  className="h-12 w-full col-span-2"
                  data-testid="skeleton"
                />
                <Skeleton className="h-12 w-full" data-testid="skeleton" />
                <Skeleton className="h-12 w-full" data-testid="skeleton" />
                <Skeleton className="h-12 w-full" data-testid="skeleton" />
                <Skeleton className="h-12 w-full" data-testid="skeleton" />
                <Skeleton className="h-12 w-full" data-testid="skeleton" />
                <Skeleton className="h-12 w-full" data-testid="skeleton" />
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
          <CardTitle>Bureaux</CardTitle>
          <CardDescription>Erreur lors du chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-8">
            {error instanceof Error ? error.message : "Une erreur est survenue"}
            <br />
            <Button onClick={() => refetch()} className="mt-4">
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
          {isFetching
            ? "Chargement..."
            : "Liste de tous les bureaux référencés sur la plateforme"}
        </CardDescription>
      </CardHeader>
      {data.offices.length > 0 ? (
        <CardContent className="space-y-4">
          <Table>
            <OfficeTableHeader handleSort={handleSort} />
            <TableBody>
              {data.offices.map((office) => (
                <OfficeTableRow key={office.id} office={office} />
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
                            page === data.pagination.page
                              ? "default"
                              : "outline"
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
                  disabled={isPlaceholderData || !data.pagination.hasNext}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent>
          <div className="text-center py-8">Aucun bureaux trouvé</div>
        </CardContent>
      )}
    </Card>
  );
}

const SortButton = ({
  field,
  sortField,
  sortOrder,
  children,
  handleSort,
}: {
  field: SortField;
  sortField?: string;
  sortOrder?: string;
  children: React.ReactNode;
  handleSort: (field: SortField) => void;
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

const OfficeTableHeader = ({
  handleSort,
}: {
  handleSort: (field: SortField) => void;
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <SortButton handleSort={handleSort} field="title">
            Nom
          </SortButton>
        </TableHead>
        <TableHead>Arrondissement</TableHead>
        <TableHead>
          <SortButton handleSort={handleSort} field="priceCents">
            Prix
          </SortButton>
        </TableHead>
        <TableHead>Capacité</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>
          <SortButton handleSort={handleSort} field="createdAt">
            Créé le
          </SortButton>
        </TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const OfficeTableRow = ({ office }: { office: OfficeWithRelations }) => {
  const formatPrice = (priceCents: number) => {
    return `${(priceCents / 100).toFixed(2)}€`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
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
            <DropdownMenuItem asChild>
              <DeleteOfficeDialog
                officeId={office.id}
                officeTitle={office.title}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const SkeletonTableRows = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="grid grid-cols-8 gap-4 w-full">
          <Skeleton className="h-12 w-full col-span-2" data-testid="skeleton" />
          <Skeleton className="h-12 w-full" data-testid="skeleton" />
          <Skeleton className="h-12 w-full" data-testid="skeleton" />
          <Skeleton className="h-12 w-full" data-testid="skeleton" />
          <Skeleton className="h-12 w-full" data-testid="skeleton" />
          <Skeleton className="h-12 w-full" data-testid="skeleton" />
          <Skeleton className="h-12 w-full" data-testid="skeleton" />
        </div>
      ))}
    </>
  );
};
