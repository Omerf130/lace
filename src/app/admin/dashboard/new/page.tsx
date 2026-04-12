import ModelForm from "@/components/ModelForm/ModelForm";
import styles from "./page.module.scss";

export default function NewModelPage() {
  return (
    <div>
      <h1 className={styles.title}>New Model</h1>
      <ModelForm />
    </div>
  );
}
