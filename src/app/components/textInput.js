import styles from './../styles/components/text-input.module.css';
import { nunito } from './../assets/fonts.js';

/**
 * Highly customised input
 *
 * @param {string} label - Placeholder label
 * @param {state} setTextState - Function to set value state
 * @param {number} maxLength - Max amount of characters that can be enetered into the input
 * @param {boolean} isDisabled - Disabled flag. True to disable, false to enable
 * @param {string} value - Value of the input
 * @param {string} error - Error text. Needs "showError" to be true to show this text
 * @param {boolean} readOnly - True if readonly, false if value can be modified
 * @param {boolean} showError - Shows error text
 * @param {callback} onChange - Function to be called when the value is changed
 */
export default function TextInput({
  label,
  setTextState,
  maxLength = 15,
  isDisabled = false,
  value = "",
  error = "",
  type = "text",
  readOnly = false,
  showError = false,
  onChange = () => {},
}) {
  return (
    <div className={nunito}>
      <input
        type={type}
        placeholder={label}
        className={showError ? styles["input-error"] : styles.input}
        maxLength={maxLength}
        onChange={onChange}
        onInput={e => setTextState(e.target.value)}
        disabled={(isDisabled)? "disabled" : ""}
        readOnly={readOnly}
        value={value}
      />
      {showError && 
        <p className={styles.error}>{error}</p>
      }
    </div>
  );
}