"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { capitalizeWords } from "@/lib/utils";
import type { IInfluencer, ModelStatus } from "@/types";
import styles from "./InfluencerForm.module.scss";

interface InfluencerFormProps {
  initialData?: IInfluencer;
}

interface FormState {
  firstName: string;
  lastName: string;
  image: string;
  tiktokUrl: string;
  tiktokFollowers: string;
  instagramUrl: string;
  instagramFollowers: string;
}

function getInitial(data?: IInfluencer): FormState {
  return {
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    image: data?.image ?? "",
    tiktokUrl: data?.tiktokUrl ?? "",
    tiktokFollowers: data?.tiktokFollowers ? String(data.tiktokFollowers) : "",
    instagramUrl: data?.instagramUrl ?? "",
    instagramFollowers: data?.instagramFollowers ? String(data.instagramFollowers) : "",
  };
}

export default function InfluencerForm({ initialData }: InfluencerFormProps) {
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
      status,
      image: form.image,
      tiktokUrl: form.tiktokUrl.trim(),
      tiktokFollowers: Number(form.tiktokFollowers) || 0,
      instagramUrl: form.instagramUrl.trim(),
      instagramFollowers: Number(form.instagramFollowers) || 0,
    };

    try {
      const url = isEdit
        ? `/api/influencers/${initialData._id}`
        : "/api/influencers";

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

      router.push("/admin/dashboard/influencers");
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

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Instagram URL</span>
            <input
              type="url"
              value={form.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
              className={styles.input}
              placeholder="https://instagram.com/..."
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Instagram Followers (K)</span>
            <input
              type="number"
              step="0.1"
              value={form.instagramFollowers}
              onChange={(e) => update("instagramFollowers", e.target.value)}
              className={styles.input}
              placeholder="e.g. 34.2"
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>TikTok URL</span>
            <input
              type="url"
              value={form.tiktokUrl}
              onChange={(e) => update("tiktokUrl", e.target.value)}
              className={styles.input}
              placeholder="https://tiktok.com/@..."
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>TikTok Followers (K)</span>
            <input
              type="number"
              step="0.1"
              value={form.tiktokFollowers}
              onChange={(e) => update("tiktokFollowers", e.target.value)}
              className={styles.input}
              placeholder="e.g. 46.6"
            />
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Image</h2>

        <ImageUploader
          label="Profile Image"
          value={form.image}
          onChange={(url) => update("image", url as string)}
        />
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
