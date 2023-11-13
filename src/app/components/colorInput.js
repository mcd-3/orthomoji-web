import { useState, useEffect } from "react";
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
  
  const isDesktop = width >= 768;

  return (
    <div className={styles.parent}>
    {isDesktop
      ?
        <div className={styles.row} onClick={() => {console.log("Parent is clicked!")}}>
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
              <input
                type="color"
                className={styles["color-input"]}
                onChange={(e) => {setColorState(e.target.value)}}
              />
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
        <div className={styles.row} onClick={() => {console.log("Parent is clicked!")}}>
          <div className={styles["input-container"]}>
            <input
              className={styles["text-input"]}
              type="text"
              placeholder={placeholder}
              readOnly={true}
            />
          </div>
          <div className={styles.color}>
            <div>
              <input className={styles["color-input"]} type="color" />
            </div>
            <div>
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
    }
    </div>
  );
}
