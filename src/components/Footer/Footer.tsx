import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>LACE</span>
      <span className={styles.copy}>
        &copy; {new Date().getFullYear()} LACE Models. All rights reserved.
      </span>
    </footer>
  );
}
