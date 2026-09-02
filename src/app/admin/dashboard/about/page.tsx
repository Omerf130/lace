"use client";

import { useState, useEffect } from "react";
import {
  DEFAULT_ABOUT_CONTENT,
  type AboutContent,
  type AboutTeamMember,
  type AboutPhone,
} from "@/lib/aboutContent";
import styles from "./page.module.scss";

export default function AboutEditorPage() {
  const [intro, setIntro] = useState("");
  const [teamMembers, setTeamMembers] = useState<AboutTeamMember[]>([]);
  const [scoutingEmail, setScoutingEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/about")
      .then((res) => res.json())
      .then((json) => {
        const data: AboutContent = json.success && json.data
          ? json.data
          : DEFAULT_ABOUT_CONTENT;
        setIntro(data.intro);
        setTeamMembers(data.teamMembers.map((m) => ({ ...m, phones: [...m.phones] })));
        setScoutingEmail(data.scoutingEmail);
      })
      .catch(() => {
        setIntro(DEFAULT_ABOUT_CONTENT.intro);
        setTeamMembers(DEFAULT_ABOUT_CONTENT.teamMembers.map((m) => ({ ...m, phones: [...m.phones] })));
        setScoutingEmail(DEFAULT_ABOUT_CONTENT.scoutingEmail);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateMember(index: number, field: keyof Omit<AboutTeamMember, "phones">, value: string) {
    setTeamMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  function updatePhone(memberIdx: number, phoneIdx: number, field: keyof AboutPhone, value: string) {
    setTeamMembers((prev) =>
      prev.map((m, i) =>
        i === memberIdx
          ? {
              ...m,
              phones: m.phones.map((p, j) =>
                j === phoneIdx ? { ...p, [field]: value } : p
              ),
            }
          : m
      )
    );
  }

  function addPhone(memberIdx: number) {
    setTeamMembers((prev) =>
      prev.map((m, i) =>
        i === memberIdx ? { ...m, phones: [...m.phones, { label: "", number: "" }] } : m
      )
    );
  }

  function removePhone(memberIdx: number, phoneIdx: number) {
    setTeamMembers((prev) =>
      prev.map((m, i) =>
        i === memberIdx
          ? { ...m, phones: m.phones.filter((_, j) => j !== phoneIdx) }
          : m
      )
    );
  }

  function addMember() {
    setTeamMembers((prev) => [
      ...prev,
      { name: "", title: "", email: "", phones: [] },
    ]);
  }

  function removeMember(index: number) {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setIsError(false);
    try {
      const res = await fetch("/api/page-content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intro, teamMembers, scoutingEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("About content saved");
        setIsError(false);
      } else {
        setMessage(data.error || "Save failed");
        setIsError(true);
      }
    } catch {
      setMessage("Save failed");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className={styles.title}>About Page</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Intro</h2>
        <textarea
          className={styles.textArea}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Agency intro text..."
          rows={4}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Team Members</h2>
          <button type="button" className={styles.addBtn} onClick={addMember}>
            + Add Member
          </button>
        </div>

        {teamMembers.map((member, mIdx) => (
          <div key={mIdx} className={styles.memberCard}>
            <div className={styles.memberHeader}>
              <span className={styles.memberIndex}>Member {mIdx + 1}</span>
              <button
                type="button"
                className={styles.removeSmallBtn}
                onClick={() => removeMember(mIdx)}
              >
                Remove
              </button>
            </div>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.fieldLabel}>Name</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={member.name}
                  onChange={(e) => updateMember(mIdx, "name", e.target.value)}
                  placeholder="Full name"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className={styles.fieldLabel}>Title</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={member.title}
                  onChange={(e) => updateMember(mIdx, "title", e.target.value)}
                  placeholder="e.g. CEO, Model Agent"
                  autoComplete="off"
                />
              </div>
            </div>

            <label className={styles.fieldLabel}>Email</label>
            <input
              type="email"
              className={styles.textInput}
              value={member.email}
              onChange={(e) => updateMember(mIdx, "email", e.target.value)}
              placeholder="email@lacemodel.com"
              autoComplete="off"
            />

            <p className={styles.phonesLabel}>Phone numbers</p>
            {member.phones.map((phone, pIdx) => (
              <div key={pIdx} className={styles.phoneRow}>
                <input
                  type="text"
                  className={styles.phoneInput}
                  value={phone.label}
                  onChange={(e) => updatePhone(mIdx, pIdx, "label", e.target.value)}
                  placeholder="Label"
                  autoComplete="off"
                />
                <input
                  type="text"
                  className={styles.phoneInput}
                  value={phone.number}
                  onChange={(e) => updatePhone(mIdx, pIdx, "number", e.target.value)}
                  placeholder="+972 ..."
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={styles.removeSmallBtn}
                  onClick={() => removePhone(mIdx, pIdx)}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className={styles.smallBtn} onClick={() => addPhone(mIdx)}>
              + Add Phone
            </button>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Scouting</h2>
        <label className={styles.fieldLabel}>Scouting Email</label>
        <input
          type="email"
          className={styles.textInput}
          value={scoutingEmail}
          onChange={(e) => setScoutingEmail(e.target.value)}
          placeholder="scouting@lacemodel.com"
          autoComplete="off"
        />
      </section>

      {message && (
        <p className={`${styles.message} ${isError ? styles.messageError : ""}`}>
          {message}
        </p>
      )}

      <button
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save About Content"}
      </button>
    </div>
  );
}
