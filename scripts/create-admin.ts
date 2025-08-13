#!/usr/bin/env tsx

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("Usage: npm run create-admin <email> <password> [role]");
    console.log(
      "Example: npm run create-admin admin@example.com Admin123! admin"
    );
    process.exit(1);
  }

  const [email, password, role = "admin"] = args;

  if (!["admin", "editor"].includes(role)) {
    console.error("❌ Role must be either 'admin' or 'editor'");
    process.exit(1);
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create admin account");
    }

    console.log(`✅ Admin account created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log(`🆔 User ID: ${data.user.id}`);
  } catch (error) {
    console.error("❌ Failed to create admin account:", error);
    process.exit(1);
  }
}

createAdmin();
