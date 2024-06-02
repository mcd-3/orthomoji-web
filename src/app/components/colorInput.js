import { useRef } from "react";
import { useWindowResize } from './../hooks/useWindowResize.js';
import styles from './../styles/components/color-input.module.css';

import { nunito } from './../assets/fonts.js';

export default function ColorInput({
  placeholder = "Color...",
  colorState,
  setColorState,
}) {
  const clearBtnStyle = colorState == "" ? styles.disabled : styles["clear-button"];
  const { isDesktop } = useWindowResize();

  const colourRef = useRef(null);
  const handleColorClick = () => {
    colourRef.current.click();
  }

  const textInput = <input
    className={styles["text-input"]}
    value={colorState}
    type="text"
    placeholder={placeholder}
    readOnly={true}
  />

  const colourButton = <input
    type="color"
    className={styles["color-input"]}
    onChange={(e) => {setColorState(e.target.value)}}
    onSelect={(e) => {setColorState(e.target.value)}}
    value={colorState}
    ref={colourRef}
  />

  return (
    <div className={styles.parent}>
    {isDesktop
      ?
        <div className={styles.row} onClick={handleColorClick}>
          <div className={styles["input-container"]}>
            { textInput }
          </div>
          <div className={styles.color}>
            <div className={styles["color-container"]}>
              { colourButton }
            </div>
            <div className={styles["clear-container"]}>
              <button
                className={`${clearBtnStyle} ${nunito}`}
                disabled={colorState == ""}
                onClick={(event) => {event.stopPropagation(); setColorState("")}}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      :
        <div onClick={handleColorClick}>
          <div className={styles.row}>
            <div className={styles["input-container"]}>
              { textInput }
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.color}>
              <div className={styles["color-container"]}>
                { colourButton }
              </div>
              <div className={styles["clear-container"]}>
                <button
                  className={`${clearBtnStyle} ${nunito}`}
                  disabled={colorState == ""}
                  onClick={(event) => {event.stopPropagation(); setColorState("")}}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
    }
    </div>
  );
}
