"use client";

import { useState, useRef } from "react";
import styles from "./PdfUploader.module.scss";

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

interface PdfUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function PdfUploader({
  label,
  value,
  onChange,
}: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.size > MAX_PDF_SIZE) {
      setError("PDF must be under 10MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Upload failed");
        return;
      }

      onChange(data.data.urls[0]);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function getFilename(url: string) {
    try {
      return decodeURIComponent(url.split("/").pop() || "PDF file");
    } catch {
      return "PDF file";
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>

      {value && (
        <div className={styles.preview}>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fileLink}
          >
            {getFilename(value)}
          </a>
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
        {uploading ? "Uploading..." : value ? "Replace PDF" : "Upload PDF"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className={styles.hidden}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
