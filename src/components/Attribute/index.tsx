import React, { memo } from 'react';

import styles from './Attribute.module.css';

interface Props {
    icon: () => JSX.Element;
    title: string;
    subtitle: string;
}
const Attribute = memo((props: Props) => {
  const { icon, title, subtitle } = props;

  return (
    <div className={styles.root}>
      <div className={styles.iconContainer}>
        {icon()}
      </div>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
});

export default Attribute;