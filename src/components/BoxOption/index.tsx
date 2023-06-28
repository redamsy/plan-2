import React, { memo } from 'react';
import styles from './BoxOption.module.css';
import { Size } from '../../models/Size';

interface Props {
  data: Size;
  setActive: React.Dispatch<React.SetStateAction<Size | undefined>>;
  isActive: boolean;
}

const BoxOption = memo((props: Props) => {
  const { data, setActive, isActive } = props;
  return (
    <div
      className={`${styles.root} ${isActive === true ? styles.isActive : ''}`}
      onClick={() => setActive(data)}
      role={'presentation'}
    >
      <span className={styles.option}>{data.name}</span>
    </div>
  );
});

export default BoxOption;