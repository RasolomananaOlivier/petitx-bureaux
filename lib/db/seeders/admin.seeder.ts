import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/drizzle";
import { accounts } from "@/lib/db/schema";
import { createClient as createClientDirect } from "@supabase/supabase-js";

interface AdminSeedData {
  email: string;
  password: string;
  role?: "admin" | "editor";
}

const defaultAdminData: AdminSeedData[] = [
  {
    email: "admin@petitsbureaux.fr",
    password: "Admin123!",
    role: "admin",
  },
  {
    email: "editor@petitsbureaux.fr",
    password: "Editor123!",
    role: "editor",
  },
];

async function getSupabaseClient() {
  try {
    return await createClient();
  } catch {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    return createClientDirect(supabaseUrl, supabaseServiceKey);
  }
}

export async function seedAdmins(
  adminData: AdminSeedData[] = defaultAdminData
) {
  console.log("🌱 Seeding admin accounts...");

  const supabase = await getSupabaseClient();

  for (const admin of adminData) {
    try {
      console.log(`Creating admin account for: ${admin.email}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          role: admin.role || "admin",
        },
      });

      if (error) {
        console.error(
          `Error creating admin user ${admin.email}:`,
          error.message
        );
        continue;
      }

      if (data.user) {
        await db.insert(accounts).values({
          userId: data.user.id,
          role: admin.role || "admin",
        });

        console.log(`✅ Admin account created successfully: ${admin.email}`);
      }
    } catch (error) {
      console.error(`Error seeding admin ${admin.email}:`, error);
    }
  }

  console.log("✅ Admin seeding completed");
}

export async function seedSingleAdmin(
  email: string,
  password: string,
  role: "admin" | "editor" = "admin"
) {
  console.log(`🌱 Creating single admin account: ${email}`);

  const supabase = await getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
      },
    });

    if (error) {
      throw new Error(`Error creating admin user: ${error.message}`);
    }

    if (data.user) {
      await db.insert(accounts).values({
        userId: data.user.id,
        role,
      });

      console.log(`✅ Admin account created successfully: ${email}`);
      return data.user;
    }
  } catch (error) {
    console.error(`Error creating admin ${email}:`, error);
    throw error;
  }
}
