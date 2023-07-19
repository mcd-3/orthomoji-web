import styles from './../styles/text-input.module.css';

import { nunito } from './../assets/fonts.js';

export default function TextInput({
  label,
}) {
  return (
    <div className={nunito}>
      <input type="text" placeholder={label} className={styles.input} maxLength={15} />
    </div>
  );
}