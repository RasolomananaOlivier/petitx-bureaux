import { seedServices, seedOffices } from "./seeders";

async function seed() {
  console.log("🌱 Starting database seeding...");
  const createdServices = await seedServices();
  await seedOffices(createdServices);
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
