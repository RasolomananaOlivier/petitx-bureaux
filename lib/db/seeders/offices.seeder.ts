import { db } from "@/lib/db/drizzle";
import { offices, officeServices, photos } from "@/lib/db/schema";

export interface OfficeData {
  title: string;
  description: string;
  slug: string;
  arr: number;
  priceCents: number;
  nbPosts: number;
  lat: number;
  lng: number;
  isFake: boolean;
  publishedAt: Date;
}

export async function seedOffices(createdServices: any[]) {
  console.log("🏢 Creating offices...");

  const officesData: OfficeData[] = [
    {
      title: "Bureau Moderne - Champs-Élysées",
      description:
        "Bureau moderne avec vue imprenable sur les Champs-Élysées. Idéal pour les entreprises premium et les startups en croissance.",
      slug: "bureau-moderne-champs-elysees",
      arr: 8,
      priceCents: 18000,
      nbPosts: 4,
      lat: 48.8698,
      lng: 2.3077,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Coworking - République",
      description:
        "Espace de coworking dynamique place de la République. Ambiance créative et réseau professionnel actif.",
      slug: "espace-coworking-republique",
      arr: 11,
      priceCents: 12000,
      nbPosts: 8,
      lat: 48.8674,
      lng: 2.3636,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Élégant - Trocadéro",
      description:
        "Bureau élégant avec vue sur la Tour Eiffel. Parfait pour les professions libérales et les entreprises internationales.",
      slug: "bureau-elegant-trocadero",
      arr: 16,
      priceCents: 28000,
      nbPosts: 2,
      lat: 48.8627,
      lng: 2.2876,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Studio Créatif - Le Marais",
      description:
        "Studio créatif dans le cœur du Marais. Ambiance loft industriel, idéal pour les designers et artistes.",
      slug: "studio-creatif-marais",
      arr: 3,
      priceCents: 9500,
      nbPosts: 6,
      lat: 48.8606,
      lng: 2.3622,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Premium - Louvre",
      description:
        "Bureau premium au cœur de Paris, à deux pas du Louvre. Vue imprenable et services haut de gamme.",
      slug: "bureau-premium-louvre",
      arr: 1,
      priceCents: 35000,
      nbPosts: 1,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Flexible - Opéra",
      description:
        "Espace de travail flexible près de l'Opéra Garnier. Adapté aux équipes en croissance et aux consultants.",
      slug: "espace-flexible-opera",
      arr: 9,
      priceCents: 16000,
      nbPosts: 5,
      lat: 48.8717,
      lng: 2.3317,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Traditionnel - Saint-Germain",
      description:
        "Bureau traditionnel dans le quartier Saint-Germain-des-Prés. Charme parisien et emplacement prestigieux.",
      slug: "bureau-traditionnel-saint-germain",
      arr: 6,
      priceCents: 22000,
      nbPosts: 3,
      lat: 48.8534,
      lng: 2.3324,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Hub Innovation - Bibliothèque",
      description:
        "Hub d'innovation près de la Bibliothèque François Mitterrand. Écosystème startup et technologies de pointe.",
      slug: "hub-innovation-bibliotheque",
      arr: 13,
      priceCents: 14000,
      nbPosts: 10,
      lat: 48.8323,
      lng: 2.3757,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Vue Seine - Invalides",
      description:
        "Bureau avec vue panoramique sur la Seine et les Invalides. Élégance et tranquillité au cœur de Paris.",
      slug: "bureau-vue-seine-invalides",
      arr: 7,
      priceCents: 32000,
      nbPosts: 2,
      lat: 48.8584,
      lng: 2.3145,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Collaboratif - Canal Saint-Martin",
      description:
        "Espace collaboratif au bord du Canal Saint-Martin. Communauté entrepreneuriale active et ambiance décontractée.",
      slug: "espace-collaboratif-canal-saint-martin",
      arr: 10,
      priceCents: 11000,
      nbPosts: 12,
      lat: 48.8721,
      lng: 2.3589,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Vue Montmartre - Pigalle",
      description:
        "Bureau avec vue sur Montmartre et le Sacré-Cœur. Quartier artistique et créatif en pleine renaissance.",
      slug: "bureau-vue-montmartre-pigalle",
      arr: 18,
      priceCents: 13000,
      nbPosts: 4,
      lat: 48.8847,
      lng: 2.3376,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Studio Moderne - Bastille",
      description:
        "Studio moderne près de la place de la Bastille. Quartier dynamique avec restaurants et commerces.",
      slug: "studio-moderne-bastille",
      arr: 11,
      priceCents: 10000,
      nbPosts: 3,
      lat: 48.8534,
      lng: 2.3688,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Écologique - Buttes-Chaumont",
      description:
        "Bureau écologique près du parc des Buttes-Chaumont. Environnement verdoyant et démarche durable.",
      slug: "bureau-ecologique-buttes-chaumont",
      arr: 19,
      priceCents: 12000,
      nbPosts: 5,
      lat: 48.8807,
      lng: 2.3822,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Tech - La Défense",
      description:
        "Espace tech dans le quartier d'affaires de La Défense. Idéal pour les entreprises technologiques.",
      slug: "espace-tech-la-defense",
      arr: 92,
      priceCents: 15000,
      nbPosts: 8,
      lat: 48.8904,
      lng: 2.2386,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Vue Tour Eiffel - Champ de Mars",
      description:
        "Bureau avec vue directe sur la Tour Eiffel. Emplacement exceptionnel pour les entreprises internationales.",
      slug: "bureau-vue-tour-eiffel-champ-mars",
      arr: 7,
      priceCents: 40000,
      nbPosts: 1,
      lat: 48.8584,
      lng: 2.2945,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Studio Artistique - Belleville",
      description:
        "Studio artistique dans le quartier multiculturel de Belleville. Ambiance créative et communauté internationale.",
      slug: "studio-artistique-belleville",
      arr: 20,
      priceCents: 8500,
      nbPosts: 4,
      lat: 48.8721,
      lng: 2.3833,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Vue Arc de Triomphe - Étoile",
      description:
        "Bureau avec vue sur l'Arc de Triomphe. Prestige et élégance au cœur du 8ème arrondissement.",
      slug: "bureau-vue-arc-triomphe-etoile",
      arr: 8,
      priceCents: 25000,
      nbPosts: 2,
      lat: 48.8738,
      lng: 2.295,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Espace Startup - Station F",
      description:
        "Espace startup près de Station F, le plus grand campus de startups au monde. Écosystème tech par excellence.",
      slug: "espace-startup-station-f",
      arr: 13,
      priceCents: 13500,
      nbPosts: 6,
      lat: 48.8323,
      lng: 2.3757,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Vue Notre-Dame - Île de la Cité",
      description:
        "Bureau avec vue sur Notre-Dame de Paris. Histoire et prestige au cœur de l'île de la Cité.",
      slug: "bureau-vue-notre-dame-ile-cite",
      arr: 4,
      priceCents: 30000,
      nbPosts: 1,
      lat: 48.853,
      lng: 2.3499,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Studio Loft - Oberkampf",
      description:
        "Studio loft dans le quartier branché d'Oberkampf. Ambiance industrielle et quartier vivant.",
      slug: "studio-loft-oberkampf",
      arr: 11,
      priceCents: 9000,
      nbPosts: 3,
      lat: 48.8634,
      lng: 2.3707,
      isFake: false,
      publishedAt: new Date(),
    },
    {
      title: "Bureau Test - Quartier Latin",
      description: "Bureau de test pour les filtres dans le Quartier Latin",
      slug: "bureau-test-quartier-latin",
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

  await seedOfficeServices(createdOffices, createdServices);
  await seedOfficePhotos(createdOffices);

  console.log("\n📊 Summary:");
  console.log(
    `- ${createdOffices.length} offices (${
      createdOffices.filter((o) => !o.isFake).length
    } real, ${createdOffices.filter((o) => o.isFake).length} fake)`
  );

  return createdOffices;
}

async function seedOfficeServices(
  createdOffices: any[],
  createdServices: any[]
) {
  const officeServicesData = [
    { officeId: createdOffices[0].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[0].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[0].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[0].id, serviceId: createdServices[3].id },

    { officeId: createdOffices[1].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[1].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[1].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[1].id, serviceId: createdServices[5].id },

    { officeId: createdOffices[2].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[2].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[2].id, serviceId: createdServices[6].id },
    { officeId: createdOffices[2].id, serviceId: createdServices[7].id },

    { officeId: createdOffices[3].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[3].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[3].id, serviceId: createdServices[8].id },

    { officeId: createdOffices[4].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[4].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[4].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[4].id, serviceId: createdServices[3].id },
    { officeId: createdOffices[4].id, serviceId: createdServices[6].id },
    { officeId: createdOffices[4].id, serviceId: createdServices[7].id },

    { officeId: createdOffices[5].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[5].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[5].id, serviceId: createdServices[5].id },
    { officeId: createdOffices[5].id, serviceId: createdServices[8].id },

    { officeId: createdOffices[6].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[6].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[6].id, serviceId: createdServices[7].id },

    { officeId: createdOffices[7].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[7].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[7].id, serviceId: createdServices[5].id },
    { officeId: createdOffices[7].id, serviceId: createdServices[8].id },

    { officeId: createdOffices[8].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[8].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[8].id, serviceId: createdServices[9].id },

    { officeId: createdOffices[9].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[9].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[9].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[9].id, serviceId: createdServices[5].id },

    { officeId: createdOffices[10].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[10].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[10].id, serviceId: createdServices[8].id },

    { officeId: createdOffices[11].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[11].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[11].id, serviceId: createdServices[5].id },

    { officeId: createdOffices[12].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[12].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[12].id, serviceId: createdServices[9].id },

    { officeId: createdOffices[13].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[13].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[13].id, serviceId: createdServices[5].id },

    { officeId: createdOffices[14].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[14].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[14].id, serviceId: createdServices[6].id },
    { officeId: createdOffices[14].id, serviceId: createdServices[7].id },

    { officeId: createdOffices[15].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[15].id, serviceId: createdServices[2].id },
    { officeId: createdOffices[15].id, serviceId: createdServices[8].id },

    { officeId: createdOffices[16].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[16].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[16].id, serviceId: createdServices[9].id },

    { officeId: createdOffices[17].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[17].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[17].id, serviceId: createdServices[5].id },

    { officeId: createdOffices[18].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[18].id, serviceId: createdServices[1].id },
    { officeId: createdOffices[18].id, serviceId: createdServices[6].id },
    { officeId: createdOffices[18].id, serviceId: createdServices[7].id },

    { officeId: createdOffices[19].id, serviceId: createdServices[0].id },
    { officeId: createdOffices[19].id, serviceId: createdServices[4].id },
    { officeId: createdOffices[19].id, serviceId: createdServices[5].id },
  ];

  console.log("🔗 Creating office services relationships...");
  const createdOfficeServices = await db
    .insert(officeServices)
    .values(officeServicesData)
    .returning();
  console.log(
    `✅ Created ${createdOfficeServices.length} office-service relationships`
  );
}

async function seedOfficePhotos(createdOffices: any[]) {
  const photosData = [
    {
      officeId: createdOffices[0].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau moderne Champs-Élysées",
    },
    {
      officeId: createdOffices[0].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Vue bureau Champs-Élysées",
    },
    {
      officeId: createdOffices[1].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Coworking République",
    },
    {
      officeId: createdOffices[1].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace coworking République",
    },
    {
      officeId: createdOffices[2].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau élégant Trocadéro",
    },
    {
      officeId: createdOffices[3].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Studio créatif Marais",
    },
    {
      officeId: createdOffices[4].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau premium Louvre",
    },
    {
      officeId: createdOffices[5].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace flexible Opéra",
    },
    {
      officeId: createdOffices[6].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau traditionnel Saint-Germain",
    },
    {
      officeId: createdOffices[7].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Hub innovation Bibliothèque",
    },
    {
      officeId: createdOffices[8].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau vue Seine Invalides",
    },
    {
      officeId: createdOffices[9].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace collaboratif Canal Saint-Martin",
    },
    {
      officeId: createdOffices[10].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau vue Montmartre Pigalle",
    },
    {
      officeId: createdOffices[11].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Studio moderne Bastille",
    },
    {
      officeId: createdOffices[12].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau écologique Buttes-Chaumont",
    },
    {
      officeId: createdOffices[13].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace tech La Défense",
    },
    {
      officeId: createdOffices[14].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau vue Tour Eiffel Champ de Mars",
    },
    {
      officeId: createdOffices[15].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Studio artistique Belleville",
    },
    {
      officeId: createdOffices[16].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau vue Arc de Triomphe Étoile",
    },
    {
      officeId: createdOffices[17].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Espace startup Station F",
    },
    {
      officeId: createdOffices[18].id,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      alt: "Bureau vue Notre-Dame Île de la Cité",
    },
    {
      officeId: createdOffices[19].id,
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      alt: "Studio loft Oberkampf",
    },
  ];

  console.log("📸 Creating photos...");
  const createdPhotos = await db.insert(photos).values(photosData).returning();
  console.log(`✅ Created ${createdPhotos.length} photos`);
}
