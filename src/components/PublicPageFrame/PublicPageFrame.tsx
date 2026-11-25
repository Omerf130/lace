import PublicNav from "@/components/PublicNav/PublicNav";
import styles from "./PublicPageFrame.module.scss";

type PublicPageFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PublicPageFrame({
  children,
  className,
}: PublicPageFrameProps) {
  return (
    <>
      <PublicNav />
      <div className={className ? `${styles.frame} ${className}` : styles.frame}>
        {children}
      </div>
    </>
  );
}