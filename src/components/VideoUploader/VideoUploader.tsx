"use client";

import { useState, useRef } from "react";
import {
  fileExceedsUploadLimit,
  uploadFilesViaBlobClient,
  uploadTooLargeMessage,
} from "@/lib/uploadClient";
import styles from "./VideoUploader.module.scss";

interface VideoUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function VideoUploader({
  label,
  value,
  onChange,
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (fileExceedsUploadLimit(file.size)) {
      setError(uploadTooLargeMessage());
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const result = await uploadFilesViaBlobClient([file]);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      onChange(result.urls[0]);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>

      {value && (
        <div className={styles.preview}>
          <video src={value} className={styles.video} muted loop playsInline />
          <button
            type="button"
            onClick={() => onChange("")}
            className={styles.removeBtn}
          >
            &times;
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={styles.uploadBtn}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : value ? "Replace Video" : "Upload Video"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4"
        onChange={handleUpload}
        className={styles.hidden}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
