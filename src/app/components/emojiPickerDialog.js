import { useState } from "react";

import styles from './../styles/emoji-picker.module.css';

import EmojiPicker from 'emoji-picker-react';

// TODO: need some functions
//    1. onDismiss: set display to false, do nothing with emoji
//    2. onSet: set display to false, set the emoji in the text box

export default function EmojiPickerDialog({
  onDismiss = () => {},
  onEmojiClick = () => {},
}) {
  return (
    <div className={styles["emoji-picker-container"]} onClick={onDismiss}>
      <div className={styles["emoji-picker"]}>
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          autoFocusSearch={false}
        />
      </div>
    </div>
  );
}
