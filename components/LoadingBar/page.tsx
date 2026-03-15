import styles from "./loadingBar.module.scss";

export default function LoadingBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}></div>
    </div>
  );
}