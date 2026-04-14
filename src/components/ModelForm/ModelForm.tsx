"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import GalleryReorder from "@/components/GalleryReorder/GalleryReorder";
import { capitalizeWords } from "@/lib/utils";
import type { IModel, ModelCategory, ModelStatus } from "@/types";
import styles from "./ModelForm.module.scss";

interface ModelFormProps {
  initialData?: IModel;
}

interface FormState {
  firstName: string;
  lastName: string;
  category: ModelCategory;
  bio: string;
  mainImage: string;
  gallery: string[];
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoes: string;
  hair: string;
  eyes: string;
}

function getInitial(data?: IModel): FormState {
  return {
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    category: data?.category ?? "women",
    bio: data?.bio ?? "",
    mainImage: data?.images.main ?? "",
    gallery: data?.images.gallery ?? [],
    height: data?.attributes.height ? String(data.attributes.height) : "",
    bust: data?.attributes.bust ? String(data.attributes.bust) : "",
    waist: data?.attributes.waist ? String(data.attributes.waist) : "",
    hips: data?.attributes.hips ? String(data.attributes.hips) : "",
    shoes: data?.attributes.shoes ? String(data.attributes.shoes) : "",
    hair: data?.attributes.hair ?? "",
    eyes: data?.attributes.eyes ?? "",
  };
}

export default function ModelForm({ initialData }: ModelFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [form, setForm] = useState<FormState>(getInitial(initialData));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(status: ModelStatus) {
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    setSaving(true);

    const payload = {
      firstName: capitalizeWords(form.firstName.trim()),
      lastName: capitalizeWords(form.lastName.trim()),
      category: form.category,
      status,
      bio: form.bio.trim(),
      images: {
        main: form.mainImage,
        gallery: form.gallery,
      },
      attributes: {
        height: Number(form.height) || 0,
        bust: Number(form.bust) || 0,
        waist: Number(form.waist) || 0,
        hips: Number(form.hips) || 0,
        shoes: Number(form.shoes) || 0,
        hair: form.hair.trim(),
        eyes: form.eyes.trim(),
      },
    };

    try {
      const url = isEdit
        ? `/api/models/${initialData._id}`
        : "/api/models";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to save.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save(initialData?.status ?? "draft");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Info</h2>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>First Name *</span>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Last Name *</span>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={styles.input}
              required
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as ModelCategory)}
            className={styles.input}
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Bio</span>
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            className={styles.textarea}
            rows={4}
          />
        </label>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Images</h2>

        <ImageUploader
          label="Main Image"
          value={form.mainImage}
          onChange={(url) => update("mainImage", url as string)}
        />

        <ImageUploader
          label="Gallery Images"
          value={form.gallery}
          multiple
          onChange={(urls) => update("gallery", urls as string[])}
        />

        {form.gallery.length > 1 && (
          <div className={styles.reorderSection}>
            <span className={styles.label}>Reorder Gallery (drag to sort)</span>
            <GalleryReorder
              images={form.gallery}
              onChange={(imgs) => update("gallery", imgs)}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Attributes</h2>

        <div className={styles.attrGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Height (cm)</span>
            <input
              type="number"
              value={form.height}
              onChange={(e) => update("height", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Bust (cm)</span>
            <input
              type="number"
              value={form.bust}
              onChange={(e) => update("bust", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Waist (cm)</span>
            <input
              type="number"
              value={form.waist}
              onChange={(e) => update("waist", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Hips (cm)</span>
            <input
              type="number"
              value={form.hips}
              onChange={(e) => update("hips", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Shoes</span>
            <input
              type="number"
              value={form.shoes}
              onChange={(e) => update("shoes", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Hair</span>
            <input
              type="text"
              value={form.hair}
              onChange={(e) => update("hair", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Eyes</span>
            <input
              type="text"
              value={form.eyes}
              onChange={(e) => update("eyes", e.target.value)}
              className={styles.input}
            />
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => save("draft")}
          className={styles.draftBtn}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => save("published")}
          className={styles.saveBtn}
          disabled={saving}
        >
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
