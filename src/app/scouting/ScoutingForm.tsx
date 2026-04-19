"use client";

import { useState } from "react";
import styles from "./ScoutingForm.module.scss";

const PHOTO_FIELDS = [
  { name: "face" as const, label: "Face" },
  { name: "side" as const, label: "Side" },
  { name: "chest" as const, label: "Chest" },
  { name: "body" as const, label: "Body" },
];

export default function ScoutingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/scouting", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!data.success) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("Thank you. Your application has been sent.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {status === "success" && <div className={styles.success}>{message}</div>}
      {status === "error" && <div className={styles.error}>{message}</div>}

      <p className={styles.intro}>
        To apply, please complete the form below and include photos of yourself: close-up and
        full-body, no makeup and no hair products, in a well-lit space. Phone photos are fine;
        wear form-fitting clothing and/or an outfit that shows your style.
      </p>

      <h2 className={styles.sectionTitle}>Your info</h2>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>First name *</span>
          <input name="firstName" type="text" className={styles.input} required autoComplete="given-name" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Last name *</span>
          <input name="lastName" type="text" className={styles.input} required autoComplete="family-name" />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Email *</span>
        <input name="email" type="email" className={styles.input} required autoComplete="email" />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Phone *</span>
        <input name="phone" type="tel" className={styles.input} required autoComplete="tel" />
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Gender *</legend>
        <div className={styles.radioRow}>
          <label className={styles.radio}>
            <input type="radio" name="gender" value="male" required />
            <span>Male</span>
          </label>
          <label className={styles.radio}>
            <input type="radio" name="gender" value="female" />
            <span>Female</span>
          </label>
          <label className={styles.radio}>
            <input type="radio" name="gender" value="non-binary" />
            <span>Non-binary</span>
          </label>
        </div>
      </fieldset>

      <h2 className={styles.sectionTitle}>Photos *</h2>
      <p className={styles.hint}>Four images required. Max ~900 KB each (~3.5 MB total).</p>

      <div className={styles.photoGrid}>
        {PHOTO_FIELDS.map(({ name, label }) => (
          <label key={name} className={styles.photoField}>
            <span className={styles.label}>{label}</span>
            <input name={name} type="file" accept="image/*" className={styles.file} required />
          </label>
        ))}
      </div>

      <fieldset className={styles.consents}>
        <label className={styles.check}>
          <input name="consentPrivacy" type="checkbox" required />
          <span>
            I have read and agree to the privacy notice. By submitting, I consent to LACE
            processing my data only to evaluate my application and to contact me.
          </span>
        </label>
        <label className={styles.check}>
          <input name="consentAge" type="checkbox" required />
          <span>I am 16 years or older (or I have parent/guardian approval).</span>
        </label>
      </fieldset>

      <p className={styles.footerNote}>
        If you have trouble uploading, email{" "}
        <a href="mailto:scouting@lacemodel.com">scouting@lacemodel.com</a>.
      </p>

      <button type="submit" className={styles.submit} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
