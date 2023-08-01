import Image from 'next/image';
import styles from './../styles/components/button.module.css';

import { nunito } from './../assets/fonts.js';

/**
 * Stylised custom button
 *
 * @param {string} text - Text to display on the button
 * @param {string} iconSrc - Button icon to display
 * @param {string} className - Name of the class
 * @param {boolean} disabled - Diable flag. True to disable, false to enable
 * @param {callback} onClick - Function to call when the button is clicked
 */
export default function Button({
    text = "",
    iconSrc = "",
    className = "",
    disabled = false,
    onClick = () => { }
}) {
  const btnStyle = disabled ? styles.disabled : className;

  return (
    <button 
      className={`${styles.button} ${btnStyle}`}
      onClick={onClick}
      disabled={disabled}
    >
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