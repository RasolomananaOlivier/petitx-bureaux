import z from "zod";

export const officeFiltersSchema = z.object({
  arr: z.coerce.number().optional(),
  minPosts: z.coerce.number().optional(),
  maxPosts: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  services: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.split(",").map(Number).filter(Boolean);
    }),
  page: z.coerce.number().default(1).catch(1),
  limit: z.coerce.number().default(10).catch(10),
  sortBy: z
    .enum(["price", "posts", "created_at"])
    .default("created_at")
    .catch("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc").catch("desc"),
});

export type OfficeFiltersType = z.infer<typeof officeFiltersSchema>;
