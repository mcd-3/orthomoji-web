import { useCollapse } from 'react-collapsed'
import Image from 'next/image';

import styles from './../styles/components/collapse-content.module.css';
import { nunito } from '../assets/fonts.js';

import arrowDown from './../assets/arrow-down.svg';
import arrowRight from './../assets/arrow-right.svg';

export default function CollapseContent({
  children,
  isExpanded,
  onExpandChange = () => {},
  collapsedText = "Expand",
  expandedText = "Collapse",
}) {
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div className={styles["container-parent"]}>
      <button
        className={styles["expand-button"]}
        // {...getToggleProps()}
        {...getToggleProps({
          onClick: () => { onExpandChange() },
        })}
      >
        <div className={styles["span-container"]}>
          <span className={styles["image-span"]}>
            {isExpanded
              ?
                <Image
                  className={styles.icon}
                  src={arrowDown}
                  width={32}
                  height={32}
                />
              :
                <Image
                  className={styles.icon}
                  src={arrowRight}
                  width={32}
                  height={32}
                />
            }
          </span>
          <span className={`${styles["text-span"]} ${nunito}`}>{isExpanded ? expandedText : collapsedText}</span>
        </div>
      </button>
      <section
        className={styles["container-children"]}
        {...getCollapseProps()}
      >
        { children }
      </section>
    </div>
  )
}