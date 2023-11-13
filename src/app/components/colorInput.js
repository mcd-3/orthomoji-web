import { useState, useEffect, useRef } from "react";
import styles from './../styles/components/color-input.module.css';

import { nunito } from './../assets/fonts.js';

export default function ColorInput({
  placeholder = "Color...",
  colorState,
  setColorState,
}) {
  const [width, setWidth] = useState(0);

  const clearBtnStyle = colorState == "" ? styles.disabled : styles["clear-button"];

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

  const colourRef = useRef(null);
  const handleColorClick = () => {
    colourRef.current.click();
  }
  
  const isDesktop = width > 768;

  const colourButton = <input
    type="color"
    className={styles["color-input"]}
    onChange={(e) => {setColorState(e.target.value)}}
    ref={colourRef}
  />

  return (
    <div className={styles.parent}>
    {isDesktop
      ?
        <div className={styles.row} onClick={handleColorClick}>
          <div className={styles["input-container"]}>
            <input
              className={styles["text-input"]}
              value={colorState}
              type="text"
              placeholder={placeholder}
              readOnly={true}
            />
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
        <div onClick={() => {colorState.click}}>
          <div className={styles.row}>
            <div className={styles["input-container"]}>
              <input
                className={styles["text-input"]}
                type="text"
                placeholder={placeholder}
                readOnly={true}
              />
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
