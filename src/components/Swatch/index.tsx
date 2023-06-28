import React, { memo } from 'react';
import styles from './Swatch.module.css';
import { Color } from '../../models/Color';

interface Props {
  data: Color;
  setActiveSwatch: React.Dispatch<React.SetStateAction<Color | undefined>>;
  isActive: boolean;
}
const Swatch = memo((props: Props) => {
  const { data, setActiveSwatch, isActive } = props;

  return (
    <button
      className={`${styles.root} ${isActive === true ? styles.isActive : ''}`}
      onClick={() => setActiveSwatch(data)}
    >
      <div
        style={{ backgroundColor: data.colorCode }}
        className={styles.circle}
      ></div>
    </button>
  );
});

export default Swatch;