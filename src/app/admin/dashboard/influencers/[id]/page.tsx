"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InfluencerForm from "@/components/InfluencerForm/InfluencerForm";
import type { IInfluencer } from "@/types";
import styles from "./page.module.scss";

export default function EditInfluencerPage() {
  const params = useParams();
  const id = params.id as string;

  const [influencer, setInfluencer] = useState<IInfluencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/influencers/${id}`);
        const data = await res.json();
        if (data.success) {
          setInfluencer(data.data);
        } else {
          setError(data.error || "Influencer not found");
        }
      } catch {
        setError("Failed to load influencer");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className={styles.status}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.status}>{error}</div>;
  }

  return (
    <div>
      <h1 className={styles.title}>
        Edit — {influencer!.firstName} {influencer!.lastName}
      </h1>
      <InfluencerForm initialData={influencer!} />
    </div>
  );
}
