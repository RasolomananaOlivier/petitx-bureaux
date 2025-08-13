import { createClient } from "../client";
import { bucketName } from "./config";
import { extractSupabasePath, isSupabasePhoto } from "./utils";

async function uploadFiles(files: File[], officeId: number): Promise<string[]> {
  const uploadedUrls: string[] = [];
  const supabase = createClient();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split(".").pop();
    const fileName = `offices/${officeId}/${Date.now()}${i}.${fileExt}`;
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("failed updaloded", error);
      continue;
      // throw error;
    }

    const res = supabase.storage.from(bucketName).getPublicUrl(data.path);

    uploadedUrls.push(res.data.publicUrl);
  }

  return uploadedUrls;
}

async function removePhotosFromStorage(
  photos: Array<{ id: number; url: string; alt: string }>
): Promise<void> {
  const supabase = createClient();
  for (const photo of photos) {
    if (isSupabasePhoto(photo.url)) {
      const path = extractSupabasePath(photo.url);
      if (path) {
        await supabase.storage.from(bucketName).remove([path]);
      }
    }
  }
}

export const supabaseStorage = {
  uploadFiles,
  removePhotosFromStorage,
};
