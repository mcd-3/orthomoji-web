import Image from 'next/image'
import Link from 'next/link'
import { dancingScript } from '../assets/fonts.js';
import styles from './../styles/navbar.module.css';
import githubLogo from '../assets/github-mark.svg';

export default function NavBar({
  title,
  github,
}) {
  return (
    <div className={styles.navbar}>
      <div className={styles["child-left"]}>
        <div className={dancingScript.className}>
          <p className={styles.title}>{title}</p>
        </div>
      </div>
      <div className={styles["child-right"]}>
        <Link href={github}>
          <Image
            className={styles.github}
            src={githubLogo}
            alt="Find me on GitHub!"
          />
        </Link>
      </div>
    </div>
  )
}
