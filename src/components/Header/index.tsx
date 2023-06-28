import React, { memo } from 'react';

import Brand from '../Brand';
import Container from '../Container';
import styles from './Header.module.css';
import { useProductState } from '../../context/productsContext';
import CircularProgressPage from '../CircularProgressPage';

export interface NavObject {
  menuLabel: string;
  menuLink: string;
}
const Header = memo(() => {
  const { loadingData } = useProductState();
  const bannerMessage = 'Free shipping worldwide';
  
  return (
      <>
      {loadingData ? (
        <CircularProgressPage />
      ) : (
        <div className={styles.root}>
          <div className={styles.headerMessageContainer}>
            <span>{bannerMessage}</span>
          </div>
          <Container size={'large'} spacing={'min'}>
            {/* header container */}
            <div className={styles.header}>
              <Brand />
            </div>
          </Container>
        </div>
      )}
    </>
  );
});

export default Header;