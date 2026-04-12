"use client";

import { useState, useEffect, useRef } from "react";
import ModelCard from "@/components/ModelCard/ModelCard";
import type { SerializedModel } from "@/types";
import styles from "./SearchInput.module.scss";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SerializedModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
          setSearched(true);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search models..."
        className={styles.input}
        autoFocus
      />

      {loading && <div className={styles.loading}>Searching...</div>}

      {!loading && searched && results.length === 0 && (
        <div className={styles.empty}>No results found.</div>
      )}

      {results.length > 0 && (
        <div className={styles.results}>
          {results.map((model) => (
            <ModelCard key={model._id} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
