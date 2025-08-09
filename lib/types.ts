export interface Office {
  id: string;
  name: string;
  description: string;
  address: string;
  arrondissement: number;
  pricePerDay: number;
  pricePerHour: number;
  capacity: number;
  amenities: string[];
  photos: string[];
  isActive: boolean;
  isFake: boolean;
  createdAt: Date;
  updatedAt: Date;
  coordinates: {
    lat: number;
    lng: number;
  };
}

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
