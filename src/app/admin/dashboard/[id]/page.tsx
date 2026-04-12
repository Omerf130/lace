"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModelForm from "@/components/ModelForm/ModelForm";
import type { IModel } from "@/types";
import styles from "./page.module.scss";

export default function EditModelPage() {
  const params = useParams();
  const id = params.id as string;

  const [model, setModel] = useState<IModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/models/${id}`);
        const data = await res.json();
        if (data.success) {
          setModel(data.data);
        } else {
          setError(data.error || "Model not found");
        }
      } catch {
        setError("Failed to load model");
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
        Edit — {model!.firstName} {model!.lastName}
      </h1>
      <ModelForm initialData={model!} />
    </div>
  );
}
