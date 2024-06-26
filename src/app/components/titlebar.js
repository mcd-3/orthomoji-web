import Image from 'next/image'
import styles from './../styles/components/titlebar.module.css';
import orthomoji_title from '/public/images/orthomoji_title.png';

/**
 * Title bar that shows the webapp's logo and some text
 *
 * @param {string} subtext - Text to show under image
 */
export default function TitleBar({
  subtext = "",
}) {
  return (
    <div className={styles["titlebar-container"]}>
      <Image
        className={styles["title-image"]}
        src={orthomoji_title}
        alt="Orthomoji"
      />
      {subtext.length > 0 &&
        <p className={styles.subtext}>{subtext}</p>
      }
    </div>
  )
}