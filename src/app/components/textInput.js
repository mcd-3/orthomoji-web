import styles from './../styles/text-input.module.css';
import { useState } from 'react';
import { nunito } from './../assets/fonts.js';

export default function TextInput({
  label,
  setTextState,
  maxLength = 15,
  isDisabled = false,
  value = "",
  error = "",
  readOnly = false,
  showError = false,
  onChange = () => {},
}) {
  return (
    <div className={nunito}>
      <input
        type="text"
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