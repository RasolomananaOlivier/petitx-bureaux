import { db } from "./drizzle";
import {
  photos,
  officeServices,
  offices,
  services,
  leads,
  accounts,
  auditLog,
} from "./schema";

async function clearDatabase() {
  console.log("🧹 Starting database cleanup...");

  try {
    console.log("📸 Clearing photos...");
    await db.delete(photos);
    console.log("✅ Photos cleared");

    console.log("🔗 Clearing office services relationships...");
    await db.delete(officeServices);
    console.log("✅ Office services relationships cleared");

    console.log("🏢 Clearing offices...");
    await db.delete(offices);
    console.log("✅ Offices cleared");

    console.log("📝 Clearing services...");
    await db.delete(services);
    console.log("✅ Services cleared");

    console.log("📞 Clearing leads...");
    await db.delete(leads);
    console.log("✅ Leads cleared");

    console.log("👤 Clearing accounts...");
    await db.delete(accounts);
    console.log("✅ Accounts cleared");

    console.log("📋 Clearing audit logs...");
    await db.delete(auditLog);
    console.log("✅ Audit logs cleared");

    console.log("🎉 Database cleanup completed successfully!");
    console.log("\n📊 Summary:");
    console.log("- All tables cleared");
    console.log("- Database is now empty and ready for fresh data");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
    throw error;
  }
}

clearDatabase()
  .catch((error) => {
    console.error("❌ Clear process failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("✅ Clear process finished. Exiting...");
    process.exit(0);
  });
