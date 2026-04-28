"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ModelCard from "@/components/ModelCard/ModelCard";
import type { SerializedModel, ModelCategory } from "@/types";
import styles from "./ModelGrid.module.scss";

interface ModelGridProps {
  initialModels: SerializedModel[];
  initialCursor: string | null;
  /** When omitted, the grid loads models across all categories (e.g. the combined AI page). */
  category?: ModelCategory;
  /** When true, this grid loads only AI models; when false, only non-AI models. */
  isAiModel: boolean;
}

export default function ModelGrid({
  initialModels,
  initialCursor,
  category,
  isAiModel,
}: ModelGridProps) {
  const [models, setModels] = useState<SerializedModel[]>(initialModels);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (cursor) params.set("cursor", cursor);
      params.set("limit", "12");
      params.set("isAiModel", isAiModel ? "true" : "false");
      const res = await fetch(`/api/models?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setModels((prev) => [...prev, ...json.data.items]);
        setCursor(json.data.nextCursor);
      }
    } catch {
      // Silently fail — user can scroll to retry
    } finally {
      setLoading(false);
    }
  }, [cursor, category, isAiModel, loading]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (models.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No models found.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {models.map((model) => (
          <ModelCard key={model._id} model={model} />
        ))}
      </div>

      {cursor && (
        <div ref={observerRef} className={styles.loader}>
          {loading && <span className={styles.dot} />}
        </div>
      )}
    </>
  );
}
