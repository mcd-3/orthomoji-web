import styles from './../styles/text-input.module.css';
import { useState } from 'react';
import { nunito } from './../assets/fonts.js';

export default function TextInput({
  label,
  setTextState,
  maxLength = 15,
  isDisabled = false,
  onChange = () => {},
}) {
  return (
    <div className={nunito}>
      <input
        type="text"
        placeholder={label}
        className={styles.input}
        maxLength={maxLength}
        onChange={onChange}
        onInput={e => setTextState(e.target.value)}
        disabled={(isDisabled)? "disabled" : ""}
      />
    </div>
  );
}