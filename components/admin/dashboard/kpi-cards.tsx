"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  TrendingUp,
  UserCheck,
  Eye,
  TrendingDown,
  FileText,
  CheckCircle,
} from "lucide-react";

interface KPICardsProps {
  kpis: {
    totalOffices: number;
    publishedOffices: number;
    draftOffices: number;
    leadsThisMonth: number;
    leadsChangePercent: number;
    conversionRate: number;
    activeAccounts: number;
    adminAccounts: number;
    editorAccounts: number;
  };
}

export function KPICards({ kpis }: KPICardsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getChangeText = (change: number) => {
    const absChange = Math.abs(change);
    const direction = change > 0 ? "+" : change < 0 ? "-" : "";
    return `${direction}${absChange.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bureaux</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(kpis.totalOffices)}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {kpis.publishedOffices} publiés
            </Badge>
            <Badge variant="outline" className="text-xs">
              {kpis.draftOffices} brouillons
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leads ce mois</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(kpis.leadsThisMonth)}
          </div>
          <div className="flex items-center space-x-1 mt-1">
            {getChangeIcon(kpis.leadsChangePercent)}
            <p className={`text-xs ${getChangeColor(kpis.leadsChangePercent)}`}>
              {getChangeText(kpis.leadsChangePercent)} vs mois dernier
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taux de conversion
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {kpis.conversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Leads convertis / Total leads
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comptes actifs</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(kpis.activeAccounts)}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="default" className="text-xs">
              {kpis.adminAccounts} admins
            </Badge>
            <Badge variant="outline" className="text-xs">
              {kpis.editorAccounts} éditeurs
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
