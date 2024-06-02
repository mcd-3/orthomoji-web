import styles from './../styles/components/footer.module.css';
import {
  MIT_LICENSE,
  MIT_LICENSE_EXTENDED,
  ICONS_PROVIDED_BY,
  JAM_ICONS
} from '../text.json';

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
        <p className={styles.text}>{MIT_LICENSE} <a className={styles.link} href={licenseHref}>{MIT_LICENSE_EXTENDED}</a></p>
      </div>
      <div className={styles["text-center"]}>
      <p className={styles.text}>{ICONS_PROVIDED_BY} <a className={styles.link} href={"https://jam-icons.com/"}>{JAM_ICONS}</a></p>
      </div>
      <div className={styles["text-right"]}>
        <p className={styles.text}><strong>{date}</strong> - {author}</p>
      </div>
    </footer>
  )
}
