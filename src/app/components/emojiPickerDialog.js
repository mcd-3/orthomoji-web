import styles from './../styles/emoji-picker.module.css';
import EmojiPicker from 'emoji-picker-react';

/**
 * Emoji picker dialog
 *
 * @param {callback} onDismiss - Function to be called when dialog is dismissed
 * @param {callback} onEmojiClick - Function to be called when an emoji is selected
 */
export default function EmojiPickerDialog({
  onDismiss = () => {},
  onEmojiClick = () => {},
}) {
  const noClick = (event) => {
    event.stopPropagation();
    console.log("Hello World!");
  };

  return (
    <div className={styles["emoji-picker-container"]} onClick={onDismiss}>
      <div className={styles["emoji-picker"]}>
        <div className={styles["emoji-dialog"]} onClick={noClick}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
          />
        </div>
      </div>
    </div>
  );
}
