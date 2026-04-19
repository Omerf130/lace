"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { IInfluencer } from "@/types";
import styles from "./page.module.scss";

export default function InfluencersListPage() {
  const [influencers, setInfluencers] = useState<IInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchInfluencers();
  }, []);

  async function fetchInfluencers() {
    try {
      const res = await fetch("/api/influencers?limit=200&status=all");
      const data = await res.json();
      if (data.success) {
        setInfluencers(data.data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/influencers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInfluencers((prev) =>
          prev.map((inf) =>
            inf._id.toString() === id
              ? { ...inf, status: newStatus as IInfluencer["status"] }
              : inf
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
      const res = await fetch(`/api/influencers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInfluencers((prev) => prev.filter((inf) => inf._id.toString() !== id));
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
        <h1 className={styles.title}>Influencers</h1>
        <Link href="/admin/dashboard/influencers/new" className={styles.addButton}>
          + New Influencer
        </Link>
      </div>

      {influencers.length === 0 ? (
        <div className={styles.empty}>
          <p>No influencers yet.</p>
          <Link href="/admin/dashboard/influencers/new" className={styles.addLink}>
            Create your first influencer
          </Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.colImage} />
            <span className={styles.colName}>Name</span>
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colActions}>Actions</span>
          </div>

          {influencers.map((inf) => {
            const id = inf._id.toString();
            const fullName = `${inf.firstName} ${inf.lastName}`;

            return (
              <div key={id} className={styles.row}>
                <div className={styles.colImage}>
                  {inf.image ? (
                    <Image
                      src={inf.image}
                      alt={fullName}
                      width={48}
                      height={64}
                      className={styles.thumb}
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder} />
                  )}
                </div>
                <span className={styles.colName}>{fullName}</span>
                <span className={styles.colStatus}>
                  <span
                    className={
                      inf.status === "published"
                        ? styles.badgePublished
                        : styles.badgeDraft
                    }
                  >
                    {inf.status ?? "draft"}
                  </span>
                </span>
                <div className={styles.colActions}>
                  <button
                    onClick={() => handleToggleStatus(id, inf.status ?? "draft")}
                    className={styles.statusBtn}
                  >
                    {inf.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/dashboard/influencers/${id}`)}
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
