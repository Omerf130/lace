import { upload } from "@vercel/blob/client";
import { MAX_UPLOAD_FILE_BYTES, MAX_UPLOAD_LABEL } from "@/lib/uploadLimits";

const BLOB_HANDLE_UPLOAD_URL = "/api/blob/handle-upload";

/** Use multipart toward Blob for files above this size (bytes). */
const MULTIPART_THRESHOLD = 4 * 1024 * 1024;

export function fileExceedsUploadLimit(size: number): boolean {
  return size > MAX_UPLOAD_FILE_BYTES;
}

export function uploadTooLargeMessage(): string {
  return `File is too large. Maximum size is ${MAX_UPLOAD_LABEL} per file.`;
}

/**
 * Admin uploads from the browser: files go directly to Vercel Blob (see handle-upload route),
 * avoiding the ~4.5 MB serverless request body limit on multipart POST to /api/upload.
 */
export async function uploadFilesViaBlobClient(
  files: File[]
): Promise<{ ok: true; urls: string[] } | { ok: false; error: string }> {
  const urls: string[] = [];
  for (const file of files) {
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: BLOB_HANDLE_UPLOAD_URL,
        multipart: file.size > MULTIPART_THRESHOLD,
        contentType: file.type || undefined,
      });
      urls.push(blob.url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/not authenticated/i.test(msg)) {
        return { ok: false, error: "Not authenticated. Please sign in again." };
      }
      if (/too large|maximum|maximumSizeInBytes|exceeds|413/i.test(msg)) {
        return { ok: false, error: uploadTooLargeMessage() };
      }
      if (/content type|not allowed|allowedContentTypes/i.test(msg)) {
        return { ok: false, error: "This file type cannot be uploaded." };
      }
      return {
        ok: false,
        error: msg.trim() || "Upload failed. Try again.",
      };
    }
  }
  return { ok: true, urls };
}
