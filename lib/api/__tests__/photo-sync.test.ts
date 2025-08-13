import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncPhotos } from "../photo-sync";
import { api } from "../axios";
import { uploadFiles } from "../upload-files";

const mockRemove = vi.fn();
const mockFrom = vi.fn(() => ({ remove: mockRemove }));
const mockStorage = { from: mockFrom };
const mockSupabase = { storage: mockStorage };

vi.mock("../axios");
vi.mock("../upload-files");
vi.mock("../supabase/client", () => ({
  createClient: vi.fn(() => mockSupabase),
}));

describe("photo-sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle empty arrays", async () => {
    const mockApi = api as any;
    mockApi.get = vi.fn();
    mockApi.delete = vi.fn();
    mockApi.post = vi.fn();

    await syncPhotos({
      newPhotos: [],
      removedPhotoIds: [],
      existingPhotos: [],
      officeId: 1,
    });

    expect(mockApi.get).not.toHaveBeenCalled();
    expect(mockApi.delete).not.toHaveBeenCalled();
    expect(uploadFiles).not.toHaveBeenCalled();
  });

  it("should handle new photos only", async () => {
    const mockApi = api as any;
    mockApi.get = vi.fn();
    mockApi.delete = vi.fn();
    mockApi.post = vi.fn().mockResolvedValue({ data: [] });

    const mockUploadFiles = uploadFiles as any;
    mockUploadFiles.mockResolvedValue(["url1", "url2"]);

    const newPhotos = [
      new File(["test"], "test1.jpg", { type: "image/jpeg" }),
      new File(["test"], "test2.jpg", { type: "image/jpeg" }),
    ];

    await syncPhotos({
      newPhotos,
      removedPhotoIds: [],
      existingPhotos: [],
      officeId: 1,
    });

    expect(mockUploadFiles).toHaveBeenCalledWith(newPhotos, 1);
    expect(mockApi.post).toHaveBeenCalledWith("/api/admin/offices/photos", {
      photos: [
        { url: "url1", alt: "Office 1" },
        { url: "url2", alt: "Office 1" },
      ],
      officeId: 1,
    });
  });

  it("should handle removed photos only", async () => {
    const mockApi = api as any;
    mockApi.delete = vi.fn().mockResolvedValue({ data: { success: true } });
    mockApi.post = vi.fn();

    const mockUploadFiles = uploadFiles as any;
    mockUploadFiles.mockResolvedValue([]);

    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
      { id: 2, url: "https://example.com/photo2.jpg", alt: "Photo 2" },
    ];

    await syncPhotos({
      newPhotos: [],
      removedPhotoIds: [1, 2],
      existingPhotos,
      officeId: 1,
    });

    expect(mockApi.delete).toHaveBeenCalledWith(
      "/api/admin/offices/photos?ids=1,2"
    );
  });

  it("should handle both new and removed photos", async () => {
    const mockApi = api as any;
    mockApi.delete = vi.fn().mockResolvedValue({ data: { success: true } });
    mockApi.post = vi.fn().mockResolvedValue({ data: [] });

    const mockUploadFiles = uploadFiles as any;
    mockUploadFiles.mockResolvedValue(["url1"]);

    const newPhotos = [new File(["test"], "test1.jpg", { type: "image/jpeg" })];
    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
    ];

    await syncPhotos({
      newPhotos,
      removedPhotoIds: [1],
      existingPhotos,
      officeId: 1,
    });

    expect(mockApi.delete).toHaveBeenCalledWith(
      "/api/admin/offices/photos?ids=1"
    );
    expect(mockUploadFiles).toHaveBeenCalledWith(newPhotos, 1);
    expect(mockApi.post).toHaveBeenCalledWith("/api/admin/offices/photos", {
      photos: [{ url: "url1", alt: "Office 1" }],
      officeId: 1,
    });
  });

  it("should handle external photos without attempting storage removal", async () => {
    const mockApi = api as any;
    mockApi.delete = vi.fn().mockResolvedValue({ data: { success: true } });
    mockApi.post = vi.fn();

    const mockUploadFiles = uploadFiles as any;
    mockUploadFiles.mockResolvedValue([]);

    const existingPhotos = [
      {
        id: 1,
        url: "https://example.com/external-photo.jpg",
        alt: "External Photo",
      },
      {
        id: 2,
        url: "https://cdn.example.com/another-external.jpg",
        alt: "Another External",
      },
    ];

    await syncPhotos({
      newPhotos: [],
      removedPhotoIds: [1, 2],
      existingPhotos,
      officeId: 1,
    });

    expect(mockApi.delete).toHaveBeenCalledWith(
      "/api/admin/offices/photos?ids=1,2"
    );
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockRemove).not.toHaveBeenCalled();
  });
});
