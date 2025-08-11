import { beforeAll, afterAll, beforeEach } from "vitest";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "@/lib/db/drizzle";
import postgres from "postgres";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/lib/db/schema";

dotenv.config({ path: ".env.test" });

// Test database connection
const testClient = postgres(process.env.POSTGRES_URL!);
export const testDb = drizzle(testClient, {
  schema,
});

beforeAll(async () => {
  // Run migrations on test database
  await migrate(testDb, { migrationsFolder: "./lib/db/migrations" });
});

afterAll(async () => {
  await testClient.end();
  await client.end();
});

beforeEach(async () => {
  // Clean database before each test
  await testDb.delete(schema.officeServices);
  await testDb.delete(schema.photos);
  await testDb.delete(schema.leads);
  await testDb.delete(schema.auditLog);
  await testDb.delete(schema.offices);
  await testDb.delete(schema.services);
  await testDb.delete(schema.accounts);
});
