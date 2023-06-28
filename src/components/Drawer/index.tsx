/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, memo } from 'react';
import CloseIcon from "@mui/icons-material/Close";

import styles from './Drawer.module.css';

interface Props {
  children: JSX.Element;
  visible?: boolean;
  close: () => void;
  top?: string;
  isReverse?: boolean;
  hideCross?: boolean;
}
const Drawer = memo(({
  children,
  visible,
  close,
  top = '0px',
  isReverse = false,
  hideCross = false,
} : Props) => {
  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  const escapeHandler = (e: KeyboardEvent) => {
    if (e?.code === undefined) return;
    if (e.code === 'Escape') close();
  };

  const showStyle =
    isReverse === true ? styles.showReverse : styles.showContent;
  const hideStyle =
    isReverse === true ? styles.hideReverse : styles.hideContent;

  return (
    <div
      style={{ top: top }}
      className={`
      ${styles.root} 
      ${visible === true ? styles.show : styles.hide}
      ${isReverse === true ? styles.isReverse : ''}
    `}
    >
      <div
        className={`${styles.overlay} ${
          visible === true ? styles.showOverlay : styles.hide
        }`}
        role={'presentation'}
        onClick={close}
      >
        <div
          className={`${styles.iconContainer} ${
            hideCross === true ? styles.hide : ''
          }`}
        >
          <CloseIcon/>
        </div>
      </div>

      <div
        className={`${styles.content} ${
          visible === true ? showStyle : hideStyle
        }`}
      >
        {children}
      </div>
    </div>
  );
});

export default Drawer;