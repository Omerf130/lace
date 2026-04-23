import type { ReactNode } from "react";
import styles from "./InfluencerSocialRow.module.scss";

export interface InfluencerSocialRowProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

export default function InfluencerSocialRow({
  instagramUrl,
  tiktokUrl,
  youtubeUrl,
}: InfluencerSocialRowProps) {
  const items: { href: string; label: string; icon: ReactNode }[] = [];

  if (instagramUrl) {
    items.push({
      href: instagramUrl,
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden>
          <path
            fill="currentColor"
            d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.81 4.81 0 0 0 12 7.2Zm0 7.93A3.13 3.13 0 1 1 15.13 12 3.14 3.14 0 0 1 12 15.13Zm5.93-8.45a1.12 1.12 0 1 1-1.12 1.12 1.12 1.12 0 0 1 1.12-1.12ZM20.4 7.2a6.09 6.09 0 0 0-1.55-3.86A6.09 6.09 0 0 0 15 .79 14.18 14.18 0 0 0 12 .6h-.05A14.18 14.18 0 0 0 9 .79 6.09 6.09 0 0 0 5.15 3.34 6.09 6.09 0 0 0 3.6 7.2a14.18 14.18 0 0 0-.19 3 14.18 14.18 0 0 0 .19 3 6.09 6.09 0 0 0 1.55 3.86A6.09 6.09 0 0 0 9 19.21a14.18 14.18 0 0 0 3 .19h.05a14.18 14.18 0 0 0 3-.19 6.09 6.09 0 0 0 3.86-1.55 6.09 6.09 0 0 0 1.55-3.86 14.18 14.18 0 0 0 .19-3 14.18 14.18 0 0 0-.19-3ZM18.86 14a4.4 4.4 0 0 1-.28 1.47 2.94 2.94 0 0 1-1.75 1.75 4.4 4.4 0 0 1-1.47.28c-.86.04-1.12.05-3.36.05s-2.5 0-3.36-.05a4.4 4.4 0 0 1-1.47-.28 2.94 2.94 0 0 1-1.75-1.75 4.4 4.4 0 0 1-.28-1.47c-.04-.86-.05-1.12-.05-3.36s0-2.5.05-3.36a4.4 4.4 0 0 1 .28-1.47 2.94 2.94 0 0 1 1.75-1.75 4.4 4.4 0 0 1 1.47-.28c.86-.04 1.12-.05 3.36-.05s2.5 0 3.36.05a4.4 4.4 0 0 1 1.47.28 2.94 2.94 0 0 1 1.75 1.75 4.4 4.4 0 0 1 .28 1.47c.04.86.05 1.12.05 3.36s0 2.5-.05 3.36Z"
          />
        </svg>
      ),
    });
  }
  if (tiktokUrl) {
    items.push({
      href: tiktokUrl,
      label: "TikTok",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden>
          <path
            fill="currentColor"
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.71 2.89 2.89 0 0 1 2.31-1.66V9.39a6.21 6.21 0 1 0 4.92 6.11V7.95a8.08 8.08 0 0 0 4.77 1.55V6.69h-.58Z"
          />
        </svg>
      ),
    });
  }
  if (youtubeUrl) {
    items.push({
      href: youtubeUrl,
      label: "YouTube",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden>
          <path
            fill="currentColor"
            d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.57A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.13c1.88.57 9.38.57 9.38.57s7.5 0 9.38-.57a3.02 3.02 0 0 0 2.12-2.13A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z"
          />
        </svg>
      ),
    });
  }

  if (items.length === 0) return null;

  return (
    <div className={styles.row}>
      {items.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
