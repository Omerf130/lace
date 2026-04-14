import { put, del } from "@vercel/blob";

export async function uploadFile(file: File): Promise<string> {
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  const results = await Promise.all(files.map(uploadFile));
  return results;
}
