import { useCollapse } from 'react-collapsed'
import Image from 'next/image';

import styles from './../styles/components/collapse-content.module.css';
import { nunito } from '/public/fonts/fonts.js';

import arrowDown from '/public/icons/arrow-down.svg';
import arrowRight from '/public/icons/arrow-right.svg';

/**
 * Container that can be collapsed
 * 
 * @param {HTML} children - HTML elements within the container
 * @param {boolean} isExpanded - True if container should be expanded. False if it should be collapsed.
 * @param {callback} onExpandChange - Callback to perform actions during expand/collapse events
 * @param {string} collapsedText - Title text if the container is collapsed
 * @param {string} expandedText - Title text if the container is expanded
 */
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