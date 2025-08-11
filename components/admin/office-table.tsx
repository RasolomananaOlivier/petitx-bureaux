"use client";

import { useState } from "react";
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
import { MoreHorizontal, Edit, Copy, Trash2, Eye } from "lucide-react";

interface OfficeTableProps {
  searchQuery: string;
}

// Mock data - replace with actual API call
const mockOffices = [
  {
    id: "1",
    name: "Bureau Marais Cosy",
    description: "Un bureau chaleureux au cœur du Marais",
    address: "15 rue des Rosiers, 75004 Paris",
    arrondissement: 4,
    pricePerDay: 45,
    pricePerHour: 8,
    capacity: 4,
    amenities: ["WiFi", "Café", "Imprimante"],
    photos: ["/office1.jpg", "/office1-2.jpg"],
    isActive: true,
    isFake: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-01"),
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: "2",
    name: "Espace Montparnasse",
    description: "Bureau moderne près de la gare",
    address: "32 avenue du Maine, 75015 Paris",
    arrondissement: 15,
    pricePerDay: 38,
    pricePerHour: 6,
    capacity: 2,
    amenities: ["WiFi", "Climatisation"],
    photos: ["/office2.jpg"],
    isActive: false,
    isFake: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-25"),
    coordinates: { lat: 48.8414, lng: 2.3206 },
  },
];

export function OfficeTable({ searchQuery }: OfficeTableProps) {
  const [offices, setOffices] = useState(mockOffices);

  const filteredOffices = offices.filter(
    (office) =>
      office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDuplicate = (office: (typeof mockOffices)[0]) => {
    const duplicated = {
      ...office,
      id: Date.now().toString(),
      name: `${office.name} (Copie)`,
      isFake: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setOffices([duplicated, ...offices]);
  };

  const handleDelete = (id: string) => {
    setOffices(offices.filter((office) => office.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bureaux ({filteredOffices.length})</CardTitle>
        <CardDescription>
          Liste de tous les bureaux référencés sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Prix/jour</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffices.map((office) => (
              <TableRow key={office.id}>
                <TableCell className="font-medium">{office.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {office.address}
                </TableCell>
                <TableCell>{office.pricePerDay}€</TableCell>
                <TableCell>{office.capacity} pers.</TableCell>
                <TableCell>
                  <Badge variant={office.isActive ? "default" : "secondary"}>
                    {office.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={office.isFake ? "destructive" : "outline"}>
                    {office.isFake ? "Factice" : "Réel"}
                  </Badge>
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
                          Voir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/offices/${office.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Éditer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDuplicate(office)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(office.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
