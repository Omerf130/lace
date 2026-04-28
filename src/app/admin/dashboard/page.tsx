"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IModel, SerializedModel } from "@/types";
import styles from "./page.module.scss";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function DashboardPage() {
  const [models, setModels] = useState<SerializedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const router = useRouter();
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchModels();
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
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

  async function persistOrder(orderedIds: string[]) {
    setSaveState("saving");
    try {
      const res = await fetch("/api/models/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save failed");
      setSaveState("saved");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = models.findIndex((m) => m._id === active.id);
    const newIndex = models.findIndex((m) => m._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = models;
    const next = arrayMove(previous, oldIndex, newIndex);
    setModels(next);

    persistOrder(next.map((m) => m._id)).catch(() => {
      setModels(previous);
    });
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Models</h1>
        <div className={styles.headerRight}>
          {saveState !== "idle" && (
            <span
              className={`${styles.savePill} ${
                saveState === "error" ? styles.savePillError : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {saveState === "saving" && "Saving order…"}
              {saveState === "saved" && "Order saved"}
              {saveState === "error" && "Order save failed"}
            </span>
          )}
          <Link href="/admin/dashboard/new" className={styles.addButton}>
            + New Model
          </Link>
        </div>
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
            <span className={styles.colHandle} aria-hidden="true" />
            <span className={styles.colImage} />
            <span className={styles.colName}>Name</span>
            <span className={styles.colCategory}>Category</span>
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colActions}>Actions</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={models.map((m) => m._id)}
              strategy={verticalListSortingStrategy}
            >
              {models.map((model) => (
                <SortableRow
                  key={model._id}
                  model={model}
                  deleting={deleting === model._id}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                  onEdit={(id) => router.push(`/admin/dashboard/${id}`)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

interface SortableRowProps {
  model: SerializedModel;
  deleting: boolean;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string) => void;
}

function SortableRow({
  model,
  deleting,
  onToggleStatus,
  onDelete,
  onEdit,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: model._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const id = model._id;
  const fullName = `${model.firstName} ${model.lastName}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.row} ${isDragging ? styles.rowDragging : ""}`}
    >
      <button
        type="button"
        className={styles.dragHandle}
        aria-label={`Drag to reorder ${fullName}`}
        {...attributes}
        {...listeners}
      >
        <span aria-hidden="true">⋮⋮</span>
      </button>
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
        {model.isAiModel && <span className={styles.aiBadge}>AI</span>}
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
          onClick={() => onToggleStatus(id, model.status ?? "draft")}
          className={styles.statusBtn}
        >
          {model.status === "published" ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onEdit(id)}
          className={styles.editBtn}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id, fullName)}
          className={styles.deleteBtn}
          disabled={deleting}
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
