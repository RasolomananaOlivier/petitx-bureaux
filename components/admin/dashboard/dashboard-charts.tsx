"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LabelList,
} from "recharts";
import { TrendingUp, Building, Funnel } from "lucide-react";

interface DashboardChartsProps {
  leadsOverTime: Array<{
    date: string;
    count: number;
  }>;
  topPerformingOffices: Array<{
    officeId: number;
    title: string;
    leadCount: number;
  }>;
  conversionFunnel: Array<{
    status: string;
    count: number;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const STATUS_LABELS = {
  pending: "En attente",
  contacted: "Contacté",
  converted: "Converti",
  rejected: "Rejeté",
};

export function DashboardCharts({
  leadsOverTime,
  topPerformingOffices,
  conversionFunnel,
}: DashboardChartsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const pieData = conversionFunnel.map((item, index) => ({
    name:
      STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Évolution des leads (30 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number) => [value, "Leads"]}
              />
              <Line
                className="bg-amber-400"
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Bureaux les plus performants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingOffices.map((office, index) => (
              <div
                key={office.officeId}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium line-clamp-1">
                    {office.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {office.leadCount} leads
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {office.leadCount > 0 ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Funnel className="w-5 h-5 mr-2" />
            Entonnoir de conversion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Leads"]} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              {conversionFunnel.map((item, index) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">
                      {STATUS_LABELS[
                        item.status as keyof typeof STATUS_LABELS
                      ] || item.status}
                    </span>
                  </div>
                  <Badge variant="outline">{item.count} leads</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
