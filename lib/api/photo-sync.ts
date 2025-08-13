import { createClient } from "../supabase/client";
import { uploadFiles } from "./upload-files";
import { api } from "./axios";

const bucketName = "petits-bureaux";

export interface PhotoSyncData {
  newPhotos: File[];
  removedPhotoIds: number[];
  existingPhotos: Array<{ id: number; url: string; alt: string }>;
  officeId: number;
}

export async function syncPhotos({
  newPhotos,
  removedPhotoIds,
  existingPhotos,
  officeId,
}: PhotoSyncData): Promise<void> {
  const supabase = createClient();

  if (removedPhotoIds.length > 0) {
    const photosToRemove = existingPhotos.filter((photo) =>
      removedPhotoIds.includes(photo.id)
    );
    await removePhotosFromStorage(photosToRemove, supabase);
    await removePhotosFromDatabase(removedPhotoIds);
  }

  if (newPhotos.length > 0) {
    const imageUrls = await uploadFiles(newPhotos, officeId);

    if (imageUrls.length > 0) {
      await api.post("/api/admin/offices/photos", {
        photos: imageUrls.map((url) => ({
          url,
          alt: `Office ${officeId}`,
        })),
        officeId,
      });
    }
  }
}

async function removePhotosFromStorage(
  photos: Array<{ id: number; url: string; alt: string }>,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  for (const photo of photos) {
    if (isSupabasePhoto(photo.url)) {
      const path = extractSupabasePath(photo.url);
      if (path) {
        await supabase.storage.from(bucketName).remove([path]);
      }
    }
  }
}

function isSupabasePhoto(url: string): boolean {
  return url.includes(bucketName) || url.includes("supabase.co");
}

function extractSupabasePath(url: string): string | null {
  if (url.includes(bucketName)) {
    return url.split(`${bucketName}/`)[1];
  }

  if (url.includes("supabase.co")) {
    const urlParts = url.split("/");
    const bucketIndex = urlParts.findIndex((part) => part === bucketName);
    if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
      return urlParts.slice(bucketIndex + 1).join("/");
    }
  }

  return null;
}

async function removePhotosFromDatabase(photoIds: number[]): Promise<void> {
  await api.delete(`/api/admin/offices/photos?ids=${photoIds.join(",")}`);
}
