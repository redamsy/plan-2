import React, { memo } from 'react';

import styles from './Container.module.css';

interface Props {
  children: React.ReactNode;
  size?: 'large'; //for now only this enum
  spacing?: 'min'; //for now only this enum
  fullMobile?: boolean;
}
const Container = memo(({ children, size, spacing, fullMobile }: Props) => {
  return (
    <div
      className={`
      ${styles.container} 
      ${size ? styles[size] : ''} ${size && spacing ? styles[spacing] : ''}
      ${fullMobile === true ? styles.fullMobile : ''}
      `}
    >
      {children}
    </div>
  );
});

export default Container;