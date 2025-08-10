import { db } from "@/lib/db/drizzle";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  const serviceNames = [
    "Salle de réunion privée",
    "Wifi",
    "Câblage RJ45",
    "Fibre",
    "Coin cafet'",
    "Espace d'attente",
    "Espace détente",
    "Ménage",
    "Tables / chaises",
    "Écran TV",
  ];

  for (const name of serviceNames) {
    // Check if already exists to avoid duplicates
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.name, name));

    if (existing.length === 0) {
      await db.insert(services).values({ name, icon: "" });
      console.log(`✅ Inserted service: ${name}`);
    } else {
      console.log(`⚠️ Service already exists: ${name}`);
    }
  }
}

seed()
  .catch((error) => {
    console.error("❌ Seed process failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("✅ Seed process finished. Exiting...");
    process.exit(0);
  });
