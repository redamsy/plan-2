import React, { memo } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import styles from './BreadCrumbs.module.css';

interface Crumb {
  label: string;
  link?: string;
}
interface Props {
  crumbs: Crumb[];
}
const BreadCrumbs = memo(({ crumbs }: Props) => {
  let crumbsOutput = crumbs;
  // TODO: investigate what this is
  // if (crumbsOutput && typeof crumbsOutput !== 'object') {
  //   if (crumbsOutput.indexOf('>') > -1) {
  //     crumbsOutput = crumbsOutput.split('>');
  //   } else {
  //     crumbsOutput = [crumbsOutput];
  //   }
  // }

  return (
    <div data-breadcrumbs className={styles.breadcrumbs}>
      {crumbsOutput &&
        crumbsOutput.map((crumb, crumbIndex) => (
          <span key={crumbIndex}>
            {crumbIndex > 0 && (
              <span className={styles.spacer}>
                <KeyboardArrowDownOutlinedIcon/>
              </span>
            )}
            {typeof crumb === 'object' && 'link' in crumb && (
              <a className={styles.crumb} href={crumb.link}>
                {crumb.label.trim()}
              </a>
            )}
            {typeof crumb === 'object' && !('link' in crumb) && (
              <span className={styles.crumb}>{crumb.label.trim()}</span>
            )}
            {/* {typeof crumb !== 'object' && (
              <span className={styles.crumb}>{crumb.trim()}</span>
            )} */}
          </span>
        ))}
    </div>
  );
});

export default BreadCrumbs;