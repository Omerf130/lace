import { put, del } from "@vercel/blob";

export async function uploadImage(file: File): Promise<string> {
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  await del(url);
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const results = await Promise.all(files.map(uploadImage));
  return results;
}
