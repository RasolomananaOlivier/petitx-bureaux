import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteOffice } from "../use-delete-office";
import { deleteAdminOffice } from "@/lib/api/admin-offices";
import { toast } from "sonner";

vi.mock("@/lib/api/admin-offices", () => ({
  deleteAdminOffice: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => {
    return QueryClientProvider({ client: queryClient, children });
  };
}

describe("useDeleteOffice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete office successfully", async () => {
    vi.mocked(deleteAdminOffice).mockResolvedValue();

    const { result } = renderHook(() => useDeleteOffice(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(deleteAdminOffice).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith("Bureau supprimé avec succès");
  });

  it("should handle delete error", async () => {
    const error = new Error("Delete failed");
    vi.mocked(deleteAdminOffice).mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteOffice(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(deleteAdminOffice).toHaveBeenCalledWith(1);
    expect(toast.error).toHaveBeenCalledWith(
      "Erreur lors de la suppression du bureau"
    );
  });
});
