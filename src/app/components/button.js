import Image from 'next/image';
import styles from './../styles/button.module.css';

import { nunito } from './../assets/fonts.js';

export default function Button({
    text = "",
    iconSrc = "",
    className = "",
    onClick = () => { }
}) {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
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