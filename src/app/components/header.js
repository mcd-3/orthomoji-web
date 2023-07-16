import styles from './../styles/header.module.css';

export default function Header({
  text,
}) {
  return (
    <p className={styles.text}>{text}</p>
  );
}