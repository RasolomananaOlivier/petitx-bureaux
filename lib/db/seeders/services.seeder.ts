import { db } from "@/lib/db/drizzle";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface ServiceData {
  name: string;
  icon: string;
}

export async function seedServices(): Promise<any[]> {
  const servicesData: ServiceData[] = [
    { name: "WiFi", icon: "wifi" },
    { name: "Parking", icon: "car" },
    { name: "Café", icon: "coffee" },
    { name: "Salle de réunion", icon: "users" },
    { name: "Imprimante", icon: "printer" },
    { name: "Climatisation", icon: "thermometer" },
    { name: "Sécurité 24/7", icon: "shield" },
    { name: "Réception", icon: "user-check" },
    { name: "Espace détente", icon: "sofa" },
    { name: "Terrasse", icon: "sun" },
  ];

  const createdServices = [];

  for (const service of servicesData) {
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.name, service.name));

    if (existing.length === 0) {
      const inserted = await db.insert(services).values(service).returning();
      createdServices.push(inserted[0]);
      console.log(`✅ Inserted service: ${service.name}`);
    } else {
      createdServices.push(existing[0]);
      console.log(`⚠️ Service already exists: ${service.name}`);
    }
  }

  return createdServices;
}
