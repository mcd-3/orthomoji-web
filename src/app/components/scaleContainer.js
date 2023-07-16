import styles from './../styles/scale-container.module.css';

export default function ScaleContainer({
  children
}) {
  return (
    <div className={styles["content-box"]}>
      <div className={styles["scale-content"]}>
        {children}
      </div>
    </div>
  )
};