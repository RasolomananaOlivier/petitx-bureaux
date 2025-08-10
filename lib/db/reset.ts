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
  console.log("🧹 Clearing database...");

  try {
    await db.delete(photos);
    await db.delete(officeServices);
    await db.delete(offices);
    await db.delete(services);
    await db.delete(leads);
    await db.delete(accounts);
    await db.delete(auditLog);

    console.log("✅ Database cleared");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
    throw error;
  }
}

async function seedServices() {
  const servicesData = [
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
    const inserted = await db.insert(services).values(service).returning();
    createdServices.push(inserted[0]);
    console.log(`✅ Inserted service: ${service.name}`);
  }

  return createdServices;
}

async function seedOffices(createdServices: any[]) {
  console.log("🏢 Creating offices...");

  const officesData = [
    {
      title: "Bureau Moderne - 8ème",
      description:
        "Bureau moderne dans le 8ème arrondissement avec vue sur les Champs-Élysées. Idéal pour les entrepreneurs et startups.",
      slug: "bureau-moderne-8eme",
      arr: 8,
      priceCents: 15000,
      nbPosts: 4,
      lat: 48.8698,
      lng: 2.3077,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Coworking - 11ème",
      description:
        "Espace de coworking dynamique dans le 11ème arrondissement. Ambiance créative et réseau professionnel.",
      slug: "espace-coworking-11eme",
      arr: 11,
      priceCents: 12000,
      nbPosts: 6,
      lat: 48.8634,
      lng: 2.3707,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Élégant - 16ème",
      description:
        "Bureau élégant et spacieux dans le 16ème arrondissement. Parfait pour les professions libérales.",
      slug: "bureau-elegant-16eme",
      arr: 16,
      priceCents: 25000,
      nbPosts: 2,
      lat: 48.8647,
      lng: 2.2758,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Studio Créatif - 3ème",
      description:
        "Studio créatif dans le Marais. Idéal pour les designers et artistes. Ambiance loft industriel.",
      slug: "studio-creatif-3eme",
      arr: 3,
      priceCents: 8000,
      nbPosts: 8,
      lat: 48.8606,
      lng: 2.3622,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Premium - 1er",
      description:
        "Bureau premium au cœur de Paris, 1er arrondissement. Vue imprenable et services haut de gamme.",
      slug: "bureau-premium-1er",
      arr: 1,
      priceCents: 35000,
      nbPosts: 1,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Flexible - 9ème",
      description:
        "Espace de travail flexible dans le 9ème arrondissement. Adapté aux équipes en croissance.",
      slug: "espace-flexible-9eme",
      arr: 9,
      priceCents: 18000,
      nbPosts: 5,
      lat: 48.8747,
      lng: 2.3376,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Traditionnel - 6ème",
      description:
        "Bureau traditionnel dans le 6ème arrondissement. Charme parisien et emplacement prestigieux.",
      slug: "bureau-traditionnel-6eme",
      arr: 6,
      priceCents: 22000,
      nbPosts: 3,
      lat: 48.8534,
      lng: 2.3324,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Hub Innovation - 13ème",
      description:
        "Hub d'innovation dans le 13ème arrondissement. Écosystème startup et technologies.",
      slug: "hub-innovation-13eme",
      arr: 13,
      priceCents: 14000,
      nbPosts: 7,
      lat: 48.8323,
      lng: 2.3557,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Vue Seine - 7ème",
      description:
        "Bureau avec vue sur la Seine dans le 7ème arrondissement. Élégance et tranquillité.",
      slug: "bureau-vue-seine-7eme",
      arr: 7,
      priceCents: 28000,
      nbPosts: 2,
      lat: 48.8584,
      lng: 2.2945,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Collaboratif - 10ème",
      description:
        "Espace collaboratif dans le 10ème arrondissement. Communauté entrepreneuriale active.",
      slug: "espace-collaboratif-10eme",
      arr: 10,
      priceCents: 11000,
      nbPosts: 9,
      lat: 48.8721,
      lng: 2.3589,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Test - 5ème",
      description: "Bureau de test pour les filtres",
      slug: "bureau-test-5eme",
      arr: 5,
      priceCents: 5000,
      nbPosts: 1,
      lat: 48.8462,
      lng: 2.3447,
      isFake: true,
      publishedAt: new Date(),
    },
  ];

  const createdOffices = await db
    .insert(offices)
    .values(officesData)
    .returning();
  console.log(`✅ Created ${createdOffices.length} offices`);

  const officeServicesData = [
    { officeId: createdOffices[0].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[0].id, serviceId: createdServices[1].id }, // Parking
    { officeId: createdOffices[0].id, serviceId: createdServices[2].id }, // Café
    { officeId: createdOffices[0].id, serviceId: createdServices[3].id }, // Salle de réunion

    { officeId: createdOffices[1].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[1].id, serviceId: createdServices[2].id }, // Café
    { officeId: createdOffices[1].id, serviceId: createdServices[4].id }, // Imprimante
    { officeId: createdOffices[1].id, serviceId: createdServices[5].id }, // Climatisation

    { officeId: createdOffices[2].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[2].id, serviceId: createdServices[1].id }, // Parking
    { officeId: createdOffices[2].id, serviceId: createdServices[6].id }, // Sécurité 24/7
    { officeId: createdOffices[2].id, serviceId: createdServices[7].id }, // Réception

    { officeId: createdOffices[3].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[3].id, serviceId: createdServices[4].id }, // Imprimante
    { officeId: createdOffices[3].id, serviceId: createdServices[8].id }, // Espace détente

    { officeId: createdOffices[4].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[4].id, serviceId: createdServices[1].id }, // Parking
    { officeId: createdOffices[4].id, serviceId: createdServices[2].id }, // Café
    { officeId: createdOffices[4].id, serviceId: createdServices[3].id }, // Salle de réunion
    { officeId: createdOffices[4].id, serviceId: createdServices[6].id }, // Sécurité 24/7
    { officeId: createdOffices[4].id, serviceId: createdServices[7].id }, // Réception

    { officeId: createdOffices[5].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[5].id, serviceId: createdServices[2].id }, // Café
    { officeId: createdOffices[5].id, serviceId: createdServices[5].id }, // Climatisation
    { officeId: createdOffices[5].id, serviceId: createdServices[8].id }, // Espace détente

    { officeId: createdOffices[6].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[6].id, serviceId: createdServices[1].id }, // Parking
    { officeId: createdOffices[6].id, serviceId: createdServices[7].id }, // Réception

    { officeId: createdOffices[7].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[7].id, serviceId: createdServices[4].id }, // Imprimante
    { officeId: createdOffices[7].id, serviceId: createdServices[5].id }, // Climatisation
    { officeId: createdOffices[7].id, serviceId: createdServices[8].id }, // Espace détente

    { officeId: createdOffices[8].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[8].id, serviceId: createdServices[1].id }, // Parking
    { officeId: createdOffices[8].id, serviceId: createdServices[9].id }, // Terrasse

    { officeId: createdOffices[9].id, serviceId: createdServices[0].id }, // WiFi
    { officeId: createdOffices[9].id, serviceId: createdServices[2].id }, // Café
    { officeId: createdOffices[9].id, serviceId: createdServices[4].id }, // Imprimante
    { officeId: createdOffices[9].id, serviceId: createdServices[5].id }, // Climatisation
  ];

  console.log("🔗 Creating office services relationships...");
  const createdOfficeServices = await db
    .insert(officeServices)
    .values(officeServicesData)
    .returning();
  console.log(
    `✅ Created ${createdOfficeServices.length} office-service relationships`
  );

  const photosData = [
    {
      officeId: createdOffices[0].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau moderne 8ème",
    },
    {
      officeId: createdOffices[0].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Vue bureau 8ème",
    },
    {
      officeId: createdOffices[1].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Coworking 11ème",
    },
    {
      officeId: createdOffices[1].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace coworking",
    },
    {
      officeId: createdOffices[2].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau élégant 16ème",
    },
    {
      officeId: createdOffices[3].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Studio créatif 3ème",
    },
    {
      officeId: createdOffices[4].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau premium 1er",
    },
    {
      officeId: createdOffices[5].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace flexible 9ème",
    },
    {
      officeId: createdOffices[6].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau traditionnel 6ème",
    },
    {
      officeId: createdOffices[7].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Hub innovation 13ème",
    },
    {
      officeId: createdOffices[8].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau vue Seine 7ème",
    },
    {
      officeId: createdOffices[9].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace collaboratif 10ème",
    },
  ];

  console.log("📸 Creating photos...");
  const createdPhotos = await db.insert(photos).values(photosData).returning();
  console.log(`✅ Created ${createdPhotos.length} photos`);

  console.log("\n📊 Summary:");
  console.log(`- ${createdServices.length} services`);
  console.log(
    `- ${createdOffices.length} offices (${
      createdOffices.filter((o) => !o.isFake).length
    } real, ${createdOffices.filter((o) => o.isFake).length} fake)`
  );
  console.log(`- ${createdOfficeServices.length} office-service relationships`);
  console.log(`- ${createdPhotos.length} photos`);

  return {
    services: createdServices,
    offices: createdOffices,
    officeServices: createdOfficeServices,
    photos: createdPhotos,
  };
}

async function reset() {
  console.log("🔄 Starting database reset...");
  await clearDatabase();
  console.log("🌱 Starting database seeding...");
  const createdServices = await seedServices();
  await seedOffices(createdServices);
  console.log("🎉 Database reset completed successfully!");
}

reset()
  .catch((error) => {
    console.error("❌ Reset process failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("✅ Reset process finished. Exiting...");
    process.exit(0);
  });
