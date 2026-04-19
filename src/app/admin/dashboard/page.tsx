"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { IModel, SerializedModel } from "@/types";
import styles from "./page.module.scss";

export default function DashboardPage() {
  const [models, setModels] = useState<SerializedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchModels();
  }, []);

  async function fetchModels() {
    try {
      const res = await fetch("/api/models?limit=200&status=all");
      const data = await res.json();
      if (data.success) {
        setModels(data.data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/models/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setModels((prev) =>
            prev.map((m) =>
            m._id === id ? { ...m, status: newStatus as IModel["status"] } : m
          )
        );
      }
    } catch {
      /* silently fail */
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/models/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setModels((prev) => prev.filter((m) => m._id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Models</h1>
        <Link href="/admin/dashboard/new" className={styles.addButton}>
          + New Model
        </Link>
      </div>

      {models.length === 0 ? (
        <div className={styles.empty}>
          <p>No models yet.</p>
          <Link href="/admin/dashboard/new" className={styles.addLink}>
            Create your first model
          </Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.colImage} />
            <span className={styles.colName}>Name</span>
            <span className={styles.colCategory}>Category</span>
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colActions}>Actions</span>
          </div>

          {models.map((model) => {
            const id = model._id;
            const fullName = `${model.firstName} ${model.lastName}`;

            return (
              <div key={id} className={styles.row}>
                <div className={styles.colImage}>
                  {model.images.main ? (
                    <Image
                      src={model.images.main}
                      alt={fullName}
                      width={48}
                      height={64}
                      className={styles.thumb}
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder} />
                  )}
                </div>
                <span className={styles.colName}>
                  {fullName}
                  {model.isAiModel && (
                    <span className={styles.aiBadge}>AI</span>
                  )}
                </span>
                <span className={styles.colCategory}>{model.category}</span>
                <span className={styles.colStatus}>
                  <span
                    className={
                      model.status === "published"
                        ? styles.badgePublished
                        : styles.badgeDraft
                    }
                  >
                    {model.status ?? "draft"}
                  </span>
                </span>
                <div className={styles.colActions}>
                  <button
                    onClick={() => handleToggleStatus(id, model.status ?? "draft")}
                    className={styles.statusBtn}
                  >
                    {model.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/dashboard/${id}`)}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id, fullName)}
                    className={styles.deleteBtn}
                    disabled={deleting === id}
                  >
                    {deleting === id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
