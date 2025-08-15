import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

interface KPIData {
  totalOffices: number;
  publishedOffices: number;
  draftOffices: number;
  leadsThisMonth: number;
  leadsChangePercent: number;
  conversionRate: number;
  activeAccounts: number;
  adminAccounts: number;
  editorAccounts: number;
}

interface ChartsData {
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

interface ActivityData {
  id: number;
  action: string;
  targetTable: string;
  targetId: number;
  actorName: string;
  createdAt: string;
}

export function useKPIs() {
  return useQuery<KPIData>({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      const response = await api.get("/api/admin/dashboard/kpis");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useCharts() {
  return useQuery<ChartsData>({
    queryKey: ["dashboard", "charts"],
    queryFn: async () => {
      const response = await api.get("/api/admin/dashboard/charts");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useActivity() {
  return useQuery<ActivityData[]>({
    queryKey: ["dashboard", "activity"],
    queryFn: async () => {
      const response = await api.get("/api/admin/dashboard/activity");
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}
