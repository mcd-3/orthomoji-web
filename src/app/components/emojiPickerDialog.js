import { useState, useEffect } from "react";
import Image from 'next/image';

import styles from './../styles/components/emoji-picker.module.css';
import EmojiPicker from 'emoji-picker-react';
import Button from './../components/button.js';

import cancelIcon from './../assets/close-rectangle.svg';
import cancelCircle from './../assets/close-circle.svg';
import btnStyles from './../styles/components/button.module.css';

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
  const [width, setWidth] = useState(0);

  useEffect(() => {
      const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
      }

      setWidth(window.innerWidth);
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  const isDesktop = width > 768;

  const noClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles["emoji-picker-container"]} onClick={onDismiss}>
      <div className={styles["emoji-picker"]}>
        <div className={styles["emoji-dialog"]} onClick={noClick}>
          {isDesktop
            ?
              <div>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                />
                <br />
                <Button
                  iconSrc={cancelIcon}
                  text={"Cancel"}
                  className={btnStyles.generate}
                  onClick={onDismiss}
                  disabled={false}
                />
              </div>
            :
              <div>
                <button className={styles["cancel-circle"]} onClick={onDismiss}>
                  <Image
                    src={cancelCircle}
                    width={48}
                    height={48}
                  />
                </button>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                />
              </div>
          }
        </div>
      </div>
    </div>
  );
}
