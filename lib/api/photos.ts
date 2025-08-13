import { api } from "./axios";

async function removePhotosFromDatabase(photoIds: number[]): Promise<void> {
  await api.delete(`/api/admin/offices/photos?ids=${photoIds.join(",")}`);
}

async function addPhotos(imageUrls: string[], officeId: number) {
  await api.post("/api/admin/offices/photos", {
    photos: imageUrls.map((url) => ({
      url,
      alt: `Office ${officeId}`,
    })),
    officeId,
  });
}

export const photosApi = {
  removePhotosFromDatabase,
  addPhotos,
};
