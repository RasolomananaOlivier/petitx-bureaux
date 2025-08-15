import { db } from "../lib/db/drizzle";
import { leads, offices } from "../lib/db/schema";

async function seedDashboardData() {
  console.log("🚀 Starting dashboard data seeding...");

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    console.log("🏢 Getting existing offices...");
    const existingOffices = await db.select().from(offices);
    console.log(`✅ Found ${existingOffices.length} offices`);

    if (existingOffices.length === 0) {
      console.log("❌ No offices found. Please seed offices first.");
      return;
    }

    console.log("📞 Checking existing leads...");
    const existingLeads = await db.select().from(leads);

    if (existingLeads.length === 0) {
      console.log("📞 Generating leads...");
      const sampleLeads = [];
      const leadStatuses = ["pending", "contacted", "converted", "rejected"];
      const leadNames = [
        "Jean Dupont",
        "Marie Martin",
        "Pierre Durand",
        "Sophie Bernard",
        "Lucas Petit",
      ];
      const leadEmails = [
        "jean@example.com",
        "marie@example.com",
        "pierre@example.com",
        "sophie@example.com",
        "lucas@example.com",
      ];

      for (let i = 0; i < 50; i++) {
        const office =
          existingOffices[Math.floor(Math.random() * existingOffices.length)];
        const status =
          leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
        const nameIndex = Math.floor(Math.random() * leadNames.length);

        const leadDate = new Date(
          oneWeekAgo.getTime() +
            Math.random() * (now.getTime() - oneWeekAgo.getTime())
        );

        sampleLeads.push({
          officeId: office.id,
          name: leadNames[nameIndex],
          email: leadEmails[nameIndex],
          phone: `+33${Math.floor(Math.random() * 90000000) + 10000000}`,
          message: `Intéressé par le bureau ${office.title}`,
          status,
          createdAt: leadDate,
          updatedAt: leadDate,
        });
      }
      await db.insert(leads).values(sampleLeads);
      console.log(`✅ Inserted ${sampleLeads.length} leads`);
    } else {
      console.log(`✅ Found ${existingLeads.length} existing leads`);
    }

    console.log("\n📊 Dashboard Data Summary:");
    console.log(`🏢 Offices: ${existingOffices.length}`);
    console.log(`📞 Leads: ${existingLeads.length || 50}`);
    console.log(`📋 Audit Logs: 0 (skipped - requires accounts)`);

    console.log("\n🎉 Dashboard data seeding completed successfully!");
    console.log("💡 You can now test the dashboard APIs with this data.");
  } catch (error) {
    console.error("❌ Dashboard seeding failed:", error);
    process.exit(1);
  }
}

seedDashboardData()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("✅ Script finished. Exiting...");
    process.exit(0);
  });
