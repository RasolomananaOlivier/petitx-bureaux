import { testDb } from "../setup";
import {
  offices,
  services,
  officeServices,
  NewOffice,
  NewService,
} from "@/lib/db/schema";
import {
  createOfficeFactory,
  createServiceFactory,
  createOfficeServiceFactory,
} from "../../lib/db/factories/office.factory";

export const seedOffice = async (data?: Partial<NewOffice>) => {
  const [office] = await testDb
    .insert(offices)
    .values(createOfficeFactory(data))
    .returning();
  return office;
};

export const seedService = async (data?: Partial<NewService>) => {
  const [service] = await testDb
    .insert(services)
    .values(createServiceFactory(data))
    .returning();
  return service;
};

export const seedOfficeService = async (
  officeId: number,
  serviceId: number
) => {
  const [officeService] = await testDb
    .insert(officeServices)
    .values(createOfficeServiceFactory(officeId, serviceId))
    .returning();
  return officeService;
};

export const seedMultipleOffices = async (count: number) => {
  const officeData = Array.from({ length: count }, (_, i) =>
    createOfficeFactory({ title: `Office ${i + 1}`, slug: `office-${i + 1}` })
  );

  return await testDb.insert(offices).values(officeData).returning();
};
