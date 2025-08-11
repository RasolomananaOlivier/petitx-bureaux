import { NewOffice, NewService, NewOfficeService } from "@/lib/db/schema";

export const createOfficeFactory = (
  overrides: Partial<NewOffice> = {}
): NewOffice => ({
  title: "Test Office",
  slug: "test-office-" + Math.random().toString(36).substr(2, 9),
  arr: 75001,
  priceCents: 150000,
  nbPosts: 10,
  lat: 48.8566,
  lng: 2.3522,
  isFake: false,
  description: "A beautiful test office",
  publishedAt: new Date(),
  ...overrides,
});

export const createServiceFactory = (
  overrides: Partial<NewService> = {}
): NewService => ({
  name: "Test Service " + Math.random().toString(36).substr(2, 9),
  icon: "building",
  ...overrides,
});

export const createOfficeServiceFactory = (
  officeId: number,
  serviceId: number
): NewOfficeService => ({
  officeId,
  serviceId,
});
