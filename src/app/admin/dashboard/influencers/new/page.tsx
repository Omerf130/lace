import InfluencerForm from "@/components/InfluencerForm/InfluencerForm";
import styles from "./page.module.scss";

export default function NewInfluencerPage() {
  return (
    <div>
      <h1 className={styles.title}>New Influencer</h1>
      <InfluencerForm />
    </div>
  );
}
