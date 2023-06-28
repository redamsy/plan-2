import React, { memo } from 'react';

import BoxOption from '../BoxOption';
import styles from './SizeList.module.css';
import { Size } from '../../models/Size';

interface Props {
  sizeList: Size[];
  activeSize?: Size;
  setActiveSize: React.Dispatch<React.SetStateAction<Size | undefined>>;
}
const SizeList = memo((props: Props) => {
  const { sizeList, setActiveSize, activeSize } = props;
  return (
    <div className={styles.root}>
      <div className={styles.sizeLabelContainer}>
        <span className={styles.label}>Size</span>
        <span className={`${styles.label} ${styles.guide}`}>Size Guide</span>
      </div>
      <div className={styles.sizeSelection}>
        {sizeList.map((sizeOption, index) => {
          return (
            <BoxOption
              key={index}
              data={sizeOption}
              setActive={setActiveSize}
              isActive={activeSize ? activeSize === sizeOption : false}
            />
          );
        })}
      </div>
    </div>
  );
});

export default SizeList;