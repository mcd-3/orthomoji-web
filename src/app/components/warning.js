import styles from './../styles/components/warning.module.css';
import { areEmojisMatching, isFontBig } from './../utils/warningCheck.js';
import {
  WARNING_EMOJI_1_2_BIG,
  WARNING_SCROLL_BLOCK,
  WARNING_CHANGE_BLOCKS,
  WARNING_EMOJI_1_2_SAME,
  WARNING_BLOCKS,
  WARNING_EMOJI_BIG,
  WARNING_SCROLL
} from '../text.json';

/**
 * Display a warning message if the emojis are too big and/or if they match
 */
export default function Warning({
  emojiSize,
  emojiArray,
}) {
  let message = "";

  if (isFontBig(emojiSize) && areEmojisMatching(emojiArray[0], emojiArray[1])) {
    message = WARNING_EMOJI_1_2_BIG
      + WARNING_SCROLL_BLOCK
      + WARNING_CHANGE_BLOCKS;
  } else if (isFontBig(emojiSize)) {
    message = WARNING_EMOJI_BIG
      + WARNING_SCROLL;
  } else if (areEmojisMatching(emojiArray[0], emojiArray[1])) {
    message = WARNING_EMOJI_1_2_SAME
      + WARNING_BLOCKS
      + WARNING_CHANGE_BLOCKS;
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