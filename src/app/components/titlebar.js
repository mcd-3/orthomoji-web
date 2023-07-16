import Image from 'next/image'
import styles from './../styles/titlebar.module.css';
import orthomoji_title from '/public/orthomoji_title.png';

export default function TitleBar({
  src,
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