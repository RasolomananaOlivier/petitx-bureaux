# Database Seeders

This directory contains database seeders for populating the application with initial data.

## Admin Seeder

The admin seeder creates admin and editor accounts using Supabase Auth, similar to the sign-up form functionality.

### Default Admin Accounts

When running the main seed script, the following default accounts are created:

- **Admin**: `admin@petitsbureaux.fr` / `Admin123!`
- **Editor**: `editor@petitsbureaux.fr` / `Editor123!`

### Usage

#### 1. Run Full Seed (includes admin accounts)

```bash
npm run db:seed
```

#### 2. Create Individual Admin Account

```bash
npm run create-admin <email> <password> [role]
```

Examples:

```bash
# Create admin account
npm run create-admin admin@example.com Admin123! admin

# Create editor account
npm run create-admin editor@example.com Editor123! editor

# Default role is admin
npm run create-admin user@example.com Password123!
```

#### 3. Programmatic Usage

```typescript
import { seedAdmins, seedSingleAdmin } from "@/lib/db/seeders";

// Create default admin accounts
await seedAdmins();

// Create custom admin accounts
await seedAdmins([
  { email: "custom@example.com", password: "Custom123!", role: "admin" },
  { email: "editor@example.com", password: "Editor123!", role: "editor" },
]);

// Create single admin account
await seedSingleAdmin("admin@example.com", "Admin123!", "admin");
```

### Features

- ✅ Uses Supabase Auth admin API (same as sign-up form)
- ✅ Automatically confirms email addresses
- ✅ Creates corresponding account records in the database
- ✅ Supports both admin and editor roles
- ✅ Error handling and logging
- ✅ Password validation (handled by Supabase)
- ✅ CLI tool for easy admin creation

### Security Notes

- Admin accounts are created with confirmed email addresses
- Passwords must meet Supabase's security requirements
- Role information is stored in both user metadata and accounts table
- Use strong passwords in production environments
