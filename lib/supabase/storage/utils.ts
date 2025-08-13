import { bucketName } from "./config";

export function isSupabasePhoto(url: string): boolean {
  return url.includes(bucketName) || url.includes("supabase.co");
}

export function extractSupabasePath(url: string): string | null {
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
