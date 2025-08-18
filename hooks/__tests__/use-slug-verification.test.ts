import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSlugVerification } from "../use-slug-verification";

vi.mock("../use-debounce", () => ({
  useDebounce: vi.fn((value) => value),
}));

global.fetch = vi.fn();

describe("useSlugVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() =>
      useSlugVerification({ slug: "", officeId: undefined })
    );

    expect(result.current.result).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should not verify when slug is empty", async () => {
    const { result } = renderHook(() =>
      useSlugVerification({ slug: "", officeId: undefined })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should not verify when disabled", async () => {
    const { result } = renderHook(() =>
      useSlugVerification({
        slug: "test-slug",
        officeId: undefined,
        enabled: false,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should verify slug successfully", async () => {
    const mockResponse = {
      available: true,
      suggestions: [],
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() =>
      useSlugVerification({ slug: "test-slug", officeId: undefined })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test-slug", officeId: undefined }),
      }
    );
  });

  it("should handle verification with officeId", async () => {
    const mockResponse = {
      available: false,
      existingOffice: { id: 1, slug: "test-slug", title: "Existing" },
      suggestions: ["test-slug-1234"],
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() =>
      useSlugVerification({ slug: "test-slug", officeId: 1 })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test-slug", officeId: 1 }),
      }
    );
  });

  it("should handle fetch error", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() =>
      useSlugVerification({ slug: "test-slug", officeId: undefined })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.result).toBe(null);
  });

  it("should handle non-ok response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() =>
      useSlugVerification({ slug: "test-slug", officeId: undefined })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Erreur lors de la vérification");
    expect(result.current.result).toBe(null);
  });
});
