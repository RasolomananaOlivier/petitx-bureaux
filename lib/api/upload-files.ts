import { createClient } from "../supabase/client";

const bucketName = "petits-bureaux";

export async function uploadFiles(
  files: File[],
  officeId: number
): Promise<string[]> {
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

    console.log("uploaded", data);

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
