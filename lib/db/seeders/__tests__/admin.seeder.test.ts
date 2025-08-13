import { describe, it, expect, vi, beforeEach } from "vitest";
import { seedSingleAdmin } from "../admin.seeder";
import { db } from "@/lib/db/drizzle";
import { accounts } from "@/lib/db/schema";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      admin: {
        createUser: vi.fn(),
      },
    },
  })),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({} as any)),
}));

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
  },
}));

describe("Admin Seeder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create admin account successfully", async () => {
    const mockSupabase = {
      auth: {
        admin: {
          createUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: "test-user-id",
                email: "admin@test.com",
              },
            },
            error: null,
          }),
        },
      },
    };

    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockReturnValue(mockSupabase as any);

    const mockDbInsert = vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);

    const result = await seedSingleAdmin(
      "admin@test.com",
      "Admin123!",
      "admin"
    );

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.auth.admin.createUser).toHaveBeenCalledWith({
      email: "admin@test.com",
      password: "Admin123!",
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    });

    expect(mockDbInsert).toHaveBeenCalledWith(accounts);
    expect(mockDbInsert().values).toHaveBeenCalledWith({
      userId: "test-user-id",
      role: "admin",
    });

    expect(result).toEqual({
      id: "test-user-id",
      email: "admin@test.com",
    });
  });

  it("should throw error when user creation fails", async () => {
    const mockSupabase = {
      auth: {
        admin: {
          createUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "User already exists" },
          }),
        },
      },
    };

    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockReturnValue(mockSupabase as any);

    await expect(
      seedSingleAdmin("admin@test.com", "Admin123!", "admin")
    ).rejects.toThrow("Error creating admin user: User already exists");
  });

  it("should create editor account with correct role", async () => {
    const mockSupabase = {
      auth: {
        admin: {
          createUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: "test-user-id",
                email: "editor@test.com",
              },
            },
            error: null,
          }),
        },
      },
    };

    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockReturnValue(mockSupabase as any);

    const mockDbInsert = vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);

    await seedSingleAdmin("editor@test.com", "Editor123!", "editor");

    expect(mockSupabase.auth.admin.createUser).toHaveBeenCalledWith({
      email: "editor@test.com",
      password: "Editor123!",
      email_confirm: true,
      user_metadata: {
        role: "editor",
      },
    });

    expect(mockDbInsert().values).toHaveBeenCalledWith({
      userId: "test-user-id",
      role: "editor",
    });
  });
});
