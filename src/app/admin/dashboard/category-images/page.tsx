"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  fileExceedsUploadLimit,
  uploadFilesViaBlobClient,
  uploadTooLargeMessage,
} from "@/lib/uploadClient";
import CategoryImageAdminPreview from "@/components/CategoryImageAdminPreview/CategoryImageAdminPreview";
import styles from "./page.module.scss";

export default function CategoryImagesAdminPage() {
  const [categoryWomenImageUrl, setCategoryWomenImageUrl] = useState("");
  const [categoryMenImageUrl, setCategoryMenImageUrl] = useState("");
  const [savedWomenUrl, setSavedWomenUrl] = useState("");
  const [savedMenUrl, setSavedMenUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingWomenImage, setUploadingWomenImage] = useState(false);
  const [uploadingMenImage, setUploadingMenImage] = useState(false);
  const [message, setMessage] = useState("");
  const womenInputRef = useRef<HTMLInputElement>(null);
  const menInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const w = json.data.categoryWomenImageUrl || "";
          const m = json.data.categoryMenImageUrl || "";
          setCategoryWomenImageUrl(w);
          setCategoryMenImageUrl(m);
          setSavedWomenUrl(w);
          setSavedMenUrl(m);
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
      const res = await fetch("/api/settings/category-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryWomenImageUrl,
          categoryMenImageUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedWomenUrl(categoryWomenImageUrl);
        setSavedMenUrl(categoryMenImageUrl);
        setMessage("Category images saved");
      } else {
        setMessage(data.error || "Save failed");
      }
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function womenSourceLabel() {
    if (categoryWomenImageUrl.trim()) {
      return "Custom image (will be used when saved)";
    }
    return "No custom image — public site uses first published Women model or neutral placeholder";
  }

  function menSourceLabel() {
    if (categoryMenImageUrl.trim()) {
      return "Custom image (will be used when saved)";
    }
    return "No custom image — public site uses first published Men model or neutral placeholder";
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className={styles.title}>Category Images</h1>
      <p className={styles.intro}>
        These portrait images appear on the Women and Men category selection screen
        when visitors enter from the homepage.
      </p>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Women</h2>
          <CategoryImageAdminPreview
            letter="W"
            imageUrl={categoryWomenImageUrl.trim() || null}
            sourceLabel={womenSourceLabel()}
          />
          {categoryWomenImageUrl && (
            <div className={styles.thumbRow}>
              <Image
                src={categoryWomenImageUrl}
                alt=""
                width={120}
                height={160}
                className={styles.thumb}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => setCategoryWomenImageUrl("")}
              >
                Remove custom image
              </button>
            </div>
          )}
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => womenInputRef.current?.click()}
            disabled={uploadingWomenImage}
          >
            {uploadingWomenImage ? "Uploading..." : "Upload image"}
          </button>
          <input
            ref={womenInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={styles.hidden}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpload(file, setCategoryWomenImageUrl, setUploadingWomenImage);
              }
              e.target.value = "";
            }}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Men</h2>
          <CategoryImageAdminPreview
            letter="M"
            imageUrl={categoryMenImageUrl.trim() || null}
            sourceLabel={menSourceLabel()}
          />
          {categoryMenImageUrl && (
            <div className={styles.thumbRow}>
              <Image
                src={categoryMenImageUrl}
                alt=""
                width={120}
                height={160}
                className={styles.thumb}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => setCategoryMenImageUrl("")}
              >
                Remove custom image
              </button>
            </div>
          )}
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => menInputRef.current?.click()}
            disabled={uploadingMenImage}
          >
            {uploadingMenImage ? "Uploading..." : "Upload image"}
          </button>
          <input
            ref={menInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={styles.hidden}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpload(file, setCategoryMenImageUrl, setUploadingMenImage);
              }
              e.target.value = "";
            }}
          />
        </section>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <button
        type="button"
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {(savedWomenUrl || savedMenUrl) && (
        <p className={styles.hint}>
          Last saved custom URLs are stored in site settings. Clearing and saving
          restores automatic fallbacks.
        </p>
      )}
    </div>
  );
}