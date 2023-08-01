import styles from './../styles/footer.module.css';

/**
 * Footer. Displayed at bottom of webapp at all times
 *
 * @param {string} licenseHref - Link to MIT license
 * @param {string} author - Author of webapp
 * @param {string} date - Date created
 */
export default function Footer({
  licenseHref,
  author,
  date,
}) {
  return (
    <footer className={styles["footer-container"]}>
      <div className={styles["text-left"]}>
        <p className={styles.text}>Open Source under MIT. <a className={styles.link} href={licenseHref}>View the license here</a></p>
      </div>
      <div className={styles["text-center"]}>
      <p className={styles.text}>Icons provided by <a className={styles.link} href={"https://jam-icons.com/"}>Jam Icons</a></p>
      </div>
      <div className={styles["text-right"]}>
        <p className={styles.text}><strong>{date}</strong> - {author}</p>
      </div>
    </footer>
  )
}
