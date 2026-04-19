"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  fileExceedsUploadLimit,
  uploadFilesViaBlobClient,
  uploadTooLargeMessage,
} from "@/lib/uploadClient";
import styles from "./page.module.scss";

type CoverType = "video" | "image" | "";

export default function SettingsPage() {
  const [coverVideoUrl, setCoverVideoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverType, setCoverType] = useState<CoverType>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCoverVideoUrl(json.data.coverVideoUrl || "");
          setCoverImageUrl(json.data.coverImageUrl || "");
          setCoverType(json.data.coverType || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(
    file: File,
    setUrl: (url: string) => void,
    setUploading: (v: boolean) => void
  ) {
    setMessage("");
    if (fileExceedsUploadLimit(file.size)) {
      setMessage(uploadTooLargeMessage());
      return;
    }
    setUploading(true);
    try {
      const result = await uploadFilesViaBlobClient([file]);
      if (result.ok) {
        setUrl(result.urls[0]);
      } else {
        setMessage(result.error);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverVideoUrl, coverImageUrl, coverType }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Settings saved");
      } else {
        setMessage(data.error || "Save failed");
      }
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className={styles.title}>Homepage Settings</h1>

      <div className={styles.sections}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Cover Video</h2>
            <label className={styles.radio}>
              <input
                type="radio"
                name="coverType"
                value="video"
                checked={coverType === "video"}
                onChange={() => setCoverType("video")}
              />
              <span>Active</span>
            </label>
          </div>

          {coverVideoUrl && (
            <div className={styles.preview}>
              <video
                src={coverVideoUrl}
                className={styles.previewMedia}
                muted
                loop
                playsInline
                autoPlay
              />
              <button
                className={styles.removeBtn}
                onClick={() => setCoverVideoUrl("")}
              >
                Remove
              </button>
            </div>
          )}

          <button
            className={styles.uploadBtn}
            onClick={() => videoInputRef.current?.click()}
            disabled={uploadingVideo}
          >
            {uploadingVideo ? "Uploading..." : "Upload Video"}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4"
            className={styles.hidden}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, setCoverVideoUrl, setUploadingVideo);
              e.target.value = "";
            }}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Cover Image</h2>
            <label className={styles.radio}>
              <input
                type="radio"
                name="coverType"
                value="image"
                checked={coverType === "image"}
                onChange={() => setCoverType("image")}
              />
              <span>Active</span>
            </label>
          </div>

          {coverImageUrl && (
            <div className={styles.preview}>
              <Image
                src={coverImageUrl}
                alt="Cover image preview"
                width={400}
                height={225}
                className={styles.previewMedia}
              />
              <button
                className={styles.removeBtn}
                onClick={() => setCoverImageUrl("")}
              >
                Remove
              </button>
            </div>
          )}

          <button
            className={styles.uploadBtn}
            onClick={() => imageInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? "Uploading..." : "Upload Image"}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={styles.hidden}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, setCoverImageUrl, setUploadingImage);
              e.target.value = "";
            }}
          />
        </section>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <button
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
