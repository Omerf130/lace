"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import styles from "./ScoutingForm.module.scss";

const PHOTO_FIELDS = [
  { name: "face" as const, label: "Face" },
  { name: "side" as const, label: "Side" },
  { name: "chest" as const, label: "Chest" },
  { name: "body" as const, label: "Body" },
] as const;

const MAX_FILE_BYTES = 900 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "gender"
  | "height"
  | "face"
  | "side"
  | "chest"
  | "body"
  | "consentPrivacy"
  | "consentAge";

type FieldErrors = Partial<Record<FieldKey, string>>;

function validateScoutingForm(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  const fd = new FormData(form);

  const firstName = String(fd.get("firstName") ?? "").trim();
  const lastName = String(fd.get("lastName") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();
  const gender = String(fd.get("gender") ?? "").trim();
  const height = String(fd.get("height") ?? "").trim();

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (!phone) errors.phone = "Phone is required.";
  if (!["male", "female", "non-binary"].includes(gender)) {
    errors.gender = "Please select a gender.";
  }
  if (!height) {
    errors.height = "Height is required.";
  } else {
    const n = Number(height);
    if (!Number.isFinite(n) || n < 100 || n > 230) {
      errors.height = "Please enter a valid height in cm (100–230).";
    }
  }

  for (const { name } of PHOTO_FIELDS) {
    const f = fd.get(name);
    if (!(f instanceof File) || f.size === 0) {
      errors[name] = "Please upload this photo.";
    } else if (!f.type.startsWith("image/")) {
      errors[name] = "Please upload an image file.";
    } else if (f.size > MAX_FILE_BYTES) {
      errors[name] = "Image must be under 900 KB.";
    }
  }

  if (fd.get("consentPrivacy") !== "on") {
    errors.consentPrivacy = "Please accept to continue.";
  }
  if (fd.get("consentAge") !== "on") {
    errors.consentAge = "Please confirm you are 16+ or have guardian approval.";
  }

  return errors;
}

function PhotoUpload({
  name,
  label,
  error,
  onFileSelected,
}: {
  name: string;
  label: string;
  error?: string;
  onFileSelected?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const applyFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      setFileName(file.name);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      onFileSelected?.();
    },
    [onFileSelected]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyFile(e.target.files?.[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dropzoneActive);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const input = inputRef.current;
    if (input) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
    }
    applyFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dropzoneActive);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.currentTarget.classList.remove(styles.dropzoneActive);
  }

  const errId = `${id}-error`;

  return (
    <div className={styles.photoField} id={`scouting-err-${name}`}>
      <span className={styles.label} id={`${id}-label`}>
        {label}
      </span>
      <div
        className={`${styles.dropzone} ${error ? styles.dropzoneInvalid : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="group"
        aria-labelledby={`${id}-label`}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
      >
        <input
          ref={inputRef}
          id={`${id}-input`}
          name={name}
          type="file"
          accept="image/*"
          className={styles.fileInputHidden}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img src={preview} alt="" className={styles.previewThumb} />
        ) : (
          <span className={styles.dropHint}>Drop an image here or</span>
        )}
        <button
          type="button"
          className={styles.chooseBtn}
          onClick={() => inputRef.current?.click()}
        >
          Choose photo
        </button>
      </div>
      {error && (
        <p id={errId} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
      <p className={styles.fileMeta} aria-live="polite">
        {fileName ? <span className={styles.fileName}>{fileName}</span> : "No file selected"}
      </p>
    </div>
  );
}

export default function ScoutingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [uploadKey, setUploadKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearField(key: FieldKey) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  useEffect(() => {
    const keys = Object.keys(fieldErrors) as FieldKey[];
    if (keys.length === 0) return;
    const el = document.getElementById(`scouting-err-${keys[0]}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [fieldErrors]);

  useEffect(() => {
    if (status !== "success") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setStatus("idle");
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    setFieldErrors({});

    const form = e.currentTarget;
    const errors = validateScoutingForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus("sending");
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
      setUploadKey((k) => k + 1);
      setFieldErrors({});
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} lang="en" noValidate>
        {status === "error" && <div className={styles.error}>{message}</div>}

        <p className={styles.intro}>
          To apply, please complete the form below and include photos of yourself: close-up and
          full-body, no makeup and no hair products, in a well-lit space. Phone photos are fine;
          wear form-fitting clothing and/or an outfit that shows your style.
        </p>

        <h2 className={styles.sectionTitle}>Your info</h2>

        <div className={styles.row}>
          <div className={styles.field} id="scouting-err-firstName">
            <label className={styles.fieldInner} htmlFor="scouting-firstName">
              <span className={styles.label}>First name *</span>
              <input
                id="scouting-firstName"
                name="firstName"
                type="text"
                className={`${styles.input} ${fieldErrors.firstName ? styles.inputInvalid : ""}`}
                autoComplete="given-name"
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby={fieldErrors.firstName ? "err-firstName" : undefined}
                onChange={() => clearField("firstName")}
              />
            </label>
            {fieldErrors.firstName && (
              <p id="err-firstName" className={styles.fieldError} role="alert">
                {fieldErrors.firstName}
              </p>
            )}
          </div>
          <div className={styles.field} id="scouting-err-lastName">
            <label className={styles.fieldInner} htmlFor="scouting-lastName">
              <span className={styles.label}>Last name *</span>
              <input
                id="scouting-lastName"
                name="lastName"
                type="text"
                className={`${styles.input} ${fieldErrors.lastName ? styles.inputInvalid : ""}`}
                autoComplete="family-name"
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby={fieldErrors.lastName ? "err-lastName" : undefined}
                onChange={() => clearField("lastName")}
              />
            </label>
            {fieldErrors.lastName && (
              <p id="err-lastName" className={styles.fieldError} role="alert">
                {fieldErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className={styles.field} id="scouting-err-email">
          <label className={styles.fieldInner} htmlFor="scouting-email">
            <span className={styles.label}>Email *</span>
            <input
              id="scouting-email"
              name="email"
              type="email"
              className={`${styles.input} ${fieldErrors.email ? styles.inputInvalid : ""}`}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "err-email" : undefined}
              onChange={() => clearField("email")}
            />
          </label>
          {fieldErrors.email && (
            <p id="err-email" className={styles.fieldError} role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className={styles.field} id="scouting-err-phone">
          <label className={styles.fieldInner} htmlFor="scouting-phone">
            <span className={styles.label}>Phone *</span>
            <input
              id="scouting-phone"
              name="phone"
              type="tel"
              className={`${styles.input} ${fieldErrors.phone ? styles.inputInvalid : ""}`}
              autoComplete="tel"
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
              onChange={() => clearField("phone")}
            />
          </label>
          {fieldErrors.phone && (
            <p id="err-phone" className={styles.fieldError} role="alert">
              {fieldErrors.phone}
            </p>
          )}
        </div>

        <div className={styles.field} id="scouting-err-height">
          <label className={styles.fieldInner} htmlFor="scouting-height">
            <span className={styles.label}>Height (cm) *</span>
            <input
              id="scouting-height"
              name="height"
              type="number"
              inputMode="numeric"
              min={100}
              max={230}
              step={1}
              className={`${styles.input} ${fieldErrors.height ? styles.inputInvalid : ""}`}
              aria-invalid={!!fieldErrors.height}
              aria-describedby={fieldErrors.height ? "err-height" : undefined}
              onChange={() => clearField("height")}
            />
          </label>
          {fieldErrors.height && (
            <p id="err-height" className={styles.fieldError} role="alert">
              {fieldErrors.height}
            </p>
          )}
        </div>

        <fieldset
          className={`${styles.fieldset} ${fieldErrors.gender ? styles.fieldsetInvalid : ""}`}
          id="scouting-err-gender"
        >
          <legend className={styles.label}>Gender *</legend>
          <div className={styles.radioRow}>
            <label className={styles.radio}>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={() => clearField("gender")}
              />
              <span>Male</span>
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={() => clearField("gender")}
              />
              <span>Female</span>
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="gender"
                value="non-binary"
                onChange={() => clearField("gender")}
              />
              <span>Non-binary</span>
            </label>
          </div>
          {fieldErrors.gender && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.gender}
            </p>
          )}
        </fieldset>

       

        <h2 className={styles.sectionTitle}>Photos *</h2>
        <p className={styles.hint}>Four images required. Max ~900 KB each (~3.5 MB total).</p>

        <div className={styles.photoGrid}>
          {PHOTO_FIELDS.map(({ name, label }) => (
            <PhotoUpload
              key={`${name}-${uploadKey}`}
              name={name}
              label={label}
              error={fieldErrors[name]}
              onFileSelected={() => clearField(name)}
            />
          ))}
        </div>

        <fieldset className={styles.consents}>
          <label
            className={`${styles.check} ${fieldErrors.consentPrivacy ? styles.checkInvalid : ""}`}
            id="scouting-err-consentPrivacy"
          >
            <input
              name="consentPrivacy"
              type="checkbox"
              onChange={() => clearField("consentPrivacy")}
            />
            <span>
              I have read and agree to the privacy notice. By submitting, I consent to LACE
              processing my data only to evaluate my application and to contact me.
            </span>
          </label>
          {fieldErrors.consentPrivacy && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.consentPrivacy}
            </p>
          )}
          <label
            className={`${styles.check} ${fieldErrors.consentAge ? styles.checkInvalid : ""}`}
            id="scouting-err-consentAge"
          >
            <input name="consentAge" type="checkbox" onChange={() => clearField("consentAge")} />
            <span>I am 16 years or older (or I have parent/guardian approval).</span>
          </label>
          {fieldErrors.consentAge && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.consentAge}
            </p>
          )}
        </fieldset>

        <p className={styles.footerNote}>
          If you have trouble uploading, email{" "}
          <a href="mailto:scouting@lacemodel.com">scouting@lacemodel.com</a>.
        </p>

        <button type="submit" className={styles.submit} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
      </form>

      {status === "success" && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setStatus("idle")}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="scouting-success-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="scouting-success-title" className={styles.modalTitle}>
              Application sent
            </h2>
            <p className={styles.modalText}>{message}</p>
            <Link href="/" className={styles.modalHomeLink}>
              Back to homepage
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
