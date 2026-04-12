"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>LACE</h1>
        <p className={styles.subtitle}>Admin</p>

        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
