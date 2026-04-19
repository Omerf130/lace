"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  fileExceedsUploadLimit,
  uploadFilesViaBlobClient,
  uploadTooLargeMessage,
} from "@/lib/uploadClient";
import styles from "./ImageUploader.module.scss";

interface ImageUploaderProps {
  label: string;
  value: string | string[];
  multiple?: boolean;
  onChange: (urls: string | string[]) => void;
}

export default function ImageUploader({
  label,
  value,
  multiple = false,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setError("");
    const list = Array.from(files);
    if (list.some((f) => fileExceedsUploadLimit(f.size))) {
      setError(uploadTooLargeMessage());
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const result = await uploadFilesViaBlobClient(list);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const newUrls = result.urls;

      if (multiple) {
        onChange([...urls, ...newUrls]);
      } else {
        onChange(newUrls[0]);
      }
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(url: string) {
    if (multiple) {
      onChange(urls.filter((u) => u !== url));
    } else {
      onChange("");
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>

      {urls.length > 0 && (
        <div className={styles.preview}>
          {urls.map((url) => (
            <div key={url} className={styles.thumbWrapper}>
              <Image
                src={url}
                alt=""
                width={80}
                height={107}
                className={styles.thumb}
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className={styles.removeBtn}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={styles.uploadBtn}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : `Upload ${label}`}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        onChange={handleUpload}
        className={styles.hidden}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
