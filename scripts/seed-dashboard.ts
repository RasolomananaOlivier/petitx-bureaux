import { seedDashboardData } from "../lib/db/seeders/dashboard.seeder";

async function seedDashboard() {
  console.log("🚀 Starting dashboard data seeding...");

  try {
    const result = await seedDashboardData();

    console.log("\n📊 Dashboard Data Summary:");
    console.log(`🏢 Offices: ${result.offices}`);
    console.log(`📝 Services: ${result.services}`);
    console.log(`👥 Accounts: ${result.accounts}`);
    console.log(`📞 Leads: ${result.leads}`);
    console.log(`📋 Audit Logs: ${result.auditLogs}`);
    console.log(`🔗 Office-Service Links: ${result.officeServices}`);

    console.log("\n🎉 Dashboard seeding completed successfully!");
  } catch (error) {
    console.error("❌ Dashboard seeding failed:", error);
    process.exit(1);
  }
}

seedDashboard()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("✅ Script finished. Exiting...");
    process.exit(0);
  });
