import { seedServices, seedOffices, seedAdmins } from "./seeders";
import { seedDashboardData } from "./seeders/dashboard.seeder";

async function seed() {
  console.log("🌱 Starting database seeding...");
  await seedAdmins();
  const createdServices = await seedServices();
  await seedOffices(createdServices);
  await seedDashboardData();
  console.log("🎉 Seeding completed successfully!");
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
