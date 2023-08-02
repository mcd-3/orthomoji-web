import { useCollapse } from 'react-collapsed'

import styles from './../styles/components/collapse-content.module.css';
import { nunito } from './../assets/fonts.js';

export default function CollapseContent({
  children,
  collapsedText = "Expand",
  expandedText = "Collapse"
}) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

  return (
    <div className={styles["container-parent"]}>
      <button
        className={styles["expand-button"]}
        {...getToggleProps()}
      >
        <div>
          <span className={nunito}>{isExpanded ? expandedText : collapsedText}</span>
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