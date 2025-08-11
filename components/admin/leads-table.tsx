"use client";

import { useState } from "react";
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

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { Lead } from "@/lib/types";

interface LeadsTableProps {
  searchQuery: string;
  statusFilter: string;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    message:
      "Bonjour, je souhaiterais réserver le bureau pour une journée la semaine prochaine.",
    officeId: "1",
    status: "new",
    source: "Website",
    createdAt: new Date("2024-02-10T10:30:00"),
    updatedAt: new Date("2024-02-10T10:30:00"),
  },
  {
    id: "2",
    name: "Pierre Martin",
    email: "p.martin@startup.fr",
    phone: "+33 7 98 76 54 32",
    message:
      "Notre équipe cherche un bureau pour 2 semaines. Avez-vous des tarifs préférentiels ?",
    officeId: "1",
    status: "contacted",
    source: "Google Ads",
    createdAt: new Date("2024-02-09T14:15:00"),
    updatedAt: new Date("2024-02-10T09:00:00"),
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.b@freelance.com",
    message:
      "Intéressée par le bureau Montparnasse pour du télétravail occasionnel.",
    officeId: "2",
    status: "qualified",
    source: "Référencement naturel",
    createdAt: new Date("2024-02-08T16:45:00"),
    updatedAt: new Date("2024-02-09T11:30:00"),
  },
];

const statusColors = {
  new: "destructive",
  contacted: "default",
  qualified: "secondary",
  converted: "default",
  rejected: "outline",
} as const;

const statusLabels = {
  new: "Nouveau",
  contacted: "Contacté",
  qualified: "Qualifié",
  converted: "Converti",
  rejected: "Rejeté",
} as const;

export function LeadsTable({ searchQuery, statusFilter }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(
      leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: newStatus, updatedAt: new Date() }
          : lead
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads ({filteredLeads.length})</CardTitle>
        <CardDescription>
          Liste des demandes clients et leur statut de suivi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Bureau</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
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
                <TableCell className="max-w-xs">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    <span className="text-sm line-clamp-3">{lead.message}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">Bureau #{lead.officeId}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{lead.source}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[lead.status]}>
                    {statusLabels[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{lead.createdAt.toLocaleDateString("fr-FR")}</div>
                    <div className="text-muted-foreground">
                      {lead.createdAt.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onValueChange={(value: Lead["status"]) =>
                      updateLeadStatus(lead.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nouveau</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="qualified">Qualifié</SelectItem>
                      <SelectItem value="converted">Converti</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
