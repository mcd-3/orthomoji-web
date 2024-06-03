import Image from 'next/image'
import Link from 'next/link'
import { dancingScript } from '/public/fonts/fonts.js';
import styles from './../styles/components/navbar.module.css';
import githubLogo from '/public/icons/github-mark.svg';

/**
 * Webapp NavBar. Displayed at all times at the top
 *
 * @param {string} title - Webapp title
 * @param {string} github - Link to GitHub repository
 */
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
