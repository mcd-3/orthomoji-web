import Image from 'next/image';
import styles from './../styles/components/canvas-message.module.css';

/**
 * Text message with an icon to display on a canvas
 *
 * @param {string} message - Message to display
 * @param {string} iconSrc - Icon to display
 * @param {string} iconAlt - Alt text for the icon
 */
export default function CanvasMessage({
  message,
  iconSrc,
  iconAlt = "",
}) {
  return (
    <div className={styles.message}>
      <div className={styles["message-text-div"]}>
        <p className={styles["message-text"]}>{message}</p>
      </div>
      <div className={styles["message-icon-div"]}>
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={64}
          height={64}
          className={styles["message-icon"]}
        />
      </div>
    </div>
  );
}