import styles from './../styles/header.module.css';

/**
 * Basic header text
 *
 * @param {string} text - Header text
 */
export default function Header({
  text,
}) {
  return (
    <p className={styles.text}>{text}</p>
  );
}