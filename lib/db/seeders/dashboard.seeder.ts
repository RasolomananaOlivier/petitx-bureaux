import { db } from "@/lib/db/drizzle";
import {
  offices,
  leads,
  accounts,
  auditLog,
  services,
  officeServices,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function seedDashboardData() {
  console.log("🌱 Seeding dashboard data...");

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const sampleOffices = [
    {
      title: "Bureau Marais Cosy",
      description: "Espace de travail moderne dans le Marais",
      slug: "bureau-marais-cosy",
      arr: 3,
      priceCents: 4500,
      nbPosts: 8,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      publishedAt: now,
      createdAt: oneMonthAgo,
      updatedAt: now,
    },
    {
      title: "Espace Montparnasse",
      description: "Bureau avec vue panoramique",
      slug: "espace-montparnasse",
      arr: 14,
      priceCents: 3800,
      nbPosts: 12,
      lat: 48.8404,
      lng: 2.3234,
      isFake: false,
      publishedAt: now,
      createdAt: oneMonthAgo,
      updatedAt: now,
    },
    {
      title: "Studio Bastille",
      description: "Studio moderne près de la place de la Bastille",
      slug: "studio-bastille",
      arr: 11,
      priceCents: 3200,
      nbPosts: 4,
      lat: 48.8534,
      lng: 2.3688,
      isFake: false,
      publishedAt: now,
      createdAt: oneMonthAgo,
      updatedAt: now,
    },
    {
      title: "Bureau République",
      description: "Espace de coworking République",
      slug: "bureau-republique",
      arr: 10,
      priceCents: 4200,
      nbPosts: 15,
      lat: 48.8674,
      lng: 2.3634,
      isFake: false,
      publishedAt: null,
      createdAt: oneMonthAgo,
      updatedAt: now,
    },
    {
      title: "Bureau Test A",
      description: "Bureau de test pour A/B testing",
      slug: "bureau-test-a",
      arr: 8,
      priceCents: 3500,
      nbPosts: 6,
      lat: 48.87,
      lng: 2.35,
      isFake: true,
      publishedAt: now,
      createdAt: oneMonthAgo,
      updatedAt: now,
    },
    {
      title: "Bureau Test B",
      description: "Bureau de test pour A/B testing",
      slug: "bureau-test-b",
      arr: 8,
      priceCents: 3800,
      nbPosts: 6,
      lat: 48.87,
      lng: 2.35,
      isFake: true,
      publishedAt: now,
      createdAt: oneMonthAgo,
      updatedAt: now,
    },
  ];

  const sampleServices = [
    { name: "WiFi", icon: "wifi" },
    { name: "Parking", icon: "car" },
    { name: "Salle de réunion", icon: "users" },
    { name: "Café", icon: "coffee" },
    { name: "Imprimante", icon: "printer" },
  ];

  try {
    console.log("📝 Checking existing services...");
    const existingServices = await db.select().from(services);
    let insertedServices = existingServices;

    if (existingServices.length === 0) {
      console.log("📝 Inserting services...");
      insertedServices = await db
        .insert(services)
        .values(sampleServices)
        .returning();
      console.log(`✅ Inserted ${insertedServices.length} services`);
    } else {
      console.log(`✅ Found ${existingServices.length} existing services`);
    }

    console.log("🏢 Checking existing offices...");
    const existingOffices = await db.select().from(offices);
    let insertedOffices = existingOffices;

    if (existingOffices.length === 0) {
      console.log("🏢 Inserting offices...");
      insertedOffices = await db
        .insert(offices)
        .values(sampleOffices)
        .returning();
      console.log(`✅ Inserted ${insertedOffices.length} offices`);
    } else {
      console.log(`✅ Found ${existingOffices.length} existing offices`);
    }

    console.log("👥 Checking existing accounts...");
    const existingAccounts = await db.select().from(accounts);
    console.log(`✅ Found ${existingAccounts.length} existing accounts`);

    if (existingAccounts.length === 0) {
      console.log(
        "⚠️  No accounts found. Please create accounts first using the admin seeder."
      );
      return {
        offices: insertedOffices.length,
        services: insertedServices.length,
        accounts: 0,
        leads: 0,
        auditLogs: 0,
        officeServices: 0,
      };
    }

    console.log("🔗 Linking offices to services...");
    const existingOfficeServices = await db.select().from(officeServices);

    if (existingOfficeServices.length === 0) {
      const officeServiceLinks = [];
      for (const office of insertedOffices) {
        const numServices = Math.floor(Math.random() * 3) + 2;
        const selectedServices = insertedServices
          .sort(() => 0.5 - Math.random())
          .slice(0, numServices);

        for (const service of selectedServices) {
          officeServiceLinks.push({
            officeId: office.id,
            serviceId: service.id,
            createdAt: now,
          });
        }
      }
      await db.insert(officeServices).values(officeServiceLinks);
      console.log(
        `✅ Linked ${officeServiceLinks.length} office-service relationships`
      );
    } else {
      console.log(
        `✅ Found ${existingOfficeServices.length} existing office-service relationships`
      );
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
          insertedOffices[Math.floor(Math.random() * insertedOffices.length)];
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

    console.log("📋 Checking existing audit logs...");
    const existingAuditLogs = await db.select().from(auditLog);

    if (existingAuditLogs.length === 0) {
      console.log("📋 Generating audit logs...");
      const sampleAuditLogs = [];
      const actions = ["create", "update", "delete", "publish", "unpublish"];
      const targetTables = ["offices", "leads", "accounts", "services"];

      for (let i = 0; i < 20; i++) {
        const actor =
          existingAccounts[Math.floor(Math.random() * existingAccounts.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const targetTable =
          targetTables[Math.floor(Math.random() * targetTables.length)];
        const targetId = Math.floor(Math.random() * 10) + 1;

        const logDate = new Date(
          oneWeekAgo.getTime() +
            Math.random() * (now.getTime() - oneWeekAgo.getTime())
        );

        sampleAuditLogs.push({
          actorId: actor.id,
          action,
          targetTable,
          targetId,
          meta: { note: `Sample audit log ${i + 1}` },
          createdAt: logDate,
        });
      }
      await db.insert(auditLog).values(sampleAuditLogs);
      console.log(`✅ Inserted ${sampleAuditLogs.length} audit logs`);
    } else {
      console.log(`✅ Found ${existingAuditLogs.length} existing audit logs`);
    }

    console.log("🎉 Dashboard data seeding completed successfully!");

    return {
      offices: insertedOffices.length,
      services: insertedServices.length,
      accounts: existingAccounts.length,
      leads: existingLeads.length || 50,
      auditLogs: existingAuditLogs.length || 20,
      officeServices: existingOfficeServices.length || 15,
    };
  } catch (error) {
    console.error("❌ Error seeding dashboard data:", error);
    throw error;
  }
}
