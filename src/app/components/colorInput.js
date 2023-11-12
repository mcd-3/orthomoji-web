import { useState, useEffect } from "react";
import styles from './../styles/components/color-input.module.css';

export default function ColorInput({
  placeholder = "Color...",
  colorState,
  setColorState,
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
  
  const isDesktop = width >= 768;

  return (
    <div className={styles.parent}>
    {isDesktop
      ?
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
            <div className={styles["color-container"]}>
              <input type="color" className={styles["color-input"]} />
            </div>
            <div className={styles["clear-container"]}>
              <button
                className={styles["clear-button"]}
                onClick={(event) => {event.stopPropagation(); console.log("Child is clicked!")}}
              >Clear</button>
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
                className={styles["clear-button"]}
                onClick={(event) => {event.stopPropagation(); console.log("Child is clicked!")}}
              >Clear</button>
            </div>
          </div>
        </div>
    }
    </div>
  );
}

// Div:
//    - onClick: show color picker
// Layout:    [         Input         ][Hex]