import styles from "./styles/loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}></div>
    </div>
  );
}
