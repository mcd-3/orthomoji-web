import styles from './../styles/components/scale-container.module.css';

/**
 * Container that scales children to fit within
 *
 * @param {*} children - HTML elements
 */
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