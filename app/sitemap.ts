import type { MetadataRoute } from "next";
import { db } from "@/lib/db/drizzle";
import { offices } from "@/lib/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const officesSlug = await db.select({ slug: offices.slug }).from(offices);
  const sitemaps = officesSlug.map((office) => ({
    url: `https://petitsbureaux.com/${office.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...sitemaps];
}
