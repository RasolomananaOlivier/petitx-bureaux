import { supabaseStorage } from "../supabase/storage";
import { photosApi } from "./photos";

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
  if (removedPhotoIds.length > 0) {
    const photosToRemove = existingPhotos.filter((photo) =>
      removedPhotoIds.includes(photo.id)
    );
    await supabaseStorage.removePhotosFromStorage(photosToRemove);
    await photosApi.removePhotosFromDatabase(removedPhotoIds);
  }

  if (newPhotos.length > 0) {
    const imageUrls = await supabaseStorage.uploadFiles(newPhotos, officeId);

    if (imageUrls.length > 0) {
      await photosApi.addPhotos(imageUrls, officeId);
    }
  }
}
