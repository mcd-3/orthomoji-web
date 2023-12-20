import styles from './../styles/components/warning.module.css';
import { areEmojisMatching, isFontBig } from './../utils/warningCheck.js';

/**
 * Display a warning message if the emojis are too big and/or if they match
 */
export default function Warning({
  emojiSize,
  emojiArray,
}) {
  let message = "";

  if (isFontBig(emojiSize) && areEmojisMatching(emojiArray[0], emojiArray[1])) {
    message = "Looks like your emoji size is big and the primary and secondary emojis are the same. "
      + "You may need to scroll the generated image to view the emoji text and you may see letters that look like blocks. "
      + "Change one of the emojis to fix the block lettering.";
  } else if (isFontBig(emojiSize)) {
    message = "Looks like your emoji size is big.\n"
      + "You may need to scroll the generated image to view the emoji text. ";
  } else if (areEmojisMatching(emojiArray[0], emojiArray[1])) {
    message = "Looks like the primary and secondary emojis are the same. "
      + "You may see letters that look like blocks. "
      + "Change one of the emojis to fix the block lettering.";
  }

  if (message.trim() !== "") {
    message = `⚠️ ${message}`;
  }

  return(
    <div className={styles.container}>
      <p className={styles.text}>{message}</p>
    </div>
  )
}