import { type Office as DbOffice } from "@/lib/db/schema";

export type Office = DbOffice;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  officeId: string;
  office?: Office;
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalVisits: number;
  totalLeads: number;
  conversionRate: number;
  topOffices: Array<{
    office: Office;
    views: number;
    leads: number;
  }>;
  recentActivity: Array<{
    type: "visit" | "lead" | "conversion";
    office?: Office;
    timestamp: Date;
  }>;
}
