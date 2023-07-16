import Image from 'next/image';
import styles from './../styles/button.module.css';

import { nunito } from './../assets/fonts.js';

export default function Button({
    text = "",
    iconSrc = "",
    className = ""
}) {
  // TODO: 3 situations here
  // 1. Icon, no text
  // 2. Text, no icon
  // 3. Icon and text

  return (
    <button className={`${styles.button} ${className}`}>
      <div className={styles.container}>
        <span className={styles["image-span"]}>
          <Image
            src={iconSrc}
            width={32}
            height={32}
          />
        </span>
        <span className={`${styles["text-span"]} ${nunito}`}>{text}</span>
      </div>
    </button>
  );
}