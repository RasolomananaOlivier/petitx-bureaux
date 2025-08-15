"use client";

import { useKPIs, useCharts, useActivity } from "@/hooks/use-dashboard";
import { KPICards } from "@/components/admin/dashboard/kpi-cards";
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { DashboardSkeleton } from "@/components/admin/dashboard/dashboard-skeleton";

export default function AdminDashboard() {
  const kpis = useKPIs();
  const charts = useCharts();
  const activity = useActivity();

  const isLoading = kpis.isLoading || charts.isLoading || activity.isLoading;
  const error = kpis.error || charts.error || activity.error;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre plateforme</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  if (!kpis.data || !charts.data || !activity.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre plateforme</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-600">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre plateforme</p>
      </div>

      <KPICards kpis={kpis.data} />

      <DashboardCharts
        leadsOverTime={charts.data.leadsOverTime}
        topPerformingOffices={charts.data.topPerformingOffices}
        conversionFunnel={charts.data.conversionFunnel}
      />

      <QuickActions recentActivity={activity.data} />
    </div>
  );
}
