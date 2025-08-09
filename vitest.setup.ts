import "@testing-library/jest-dom";
import { vi } from "vitest";

// Next.js navigation mocks
vi.mock("next/navigation", () => {
  const push = vi.fn();
  const replace = vi.fn();
  const back = vi.fn();
  return {
    useRouter: () => ({ push, replace, back }),
  };
});

// Supabase client mock
vi.mock("@/lib/supabase/client", () => {
  return {
    createClient: () => ({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      },
    }),
  };
});
