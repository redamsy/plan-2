import React, { useState, memo } from 'react';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import styles from './AdjustItem.module.css';

const AdjustItem = memo((props: { isTransparent?: boolean; qty?: number; setQty?: React.Dispatch<React.SetStateAction<number>>}) => {
  const { isTransparent } = props;
  const [qty, setQty] = useState(1);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    setQty(num);
  };

  return (
    <div
      className={`${styles.root} ${
        isTransparent === true ? styles.transparent : ''
      }`}
    >
      <div
        className={styles.iconContainer}
        role={'presentation'}
        onClick={() => {
          if (qty <= 1) return;
          setQty(qty - 1);
          return;
        }}
      >
        <RemoveOutlinedIcon/>
      </div>
      <div className={styles.inputContainer}>
        <input
          className={`${isTransparent === true ? styles.transparentInput : ''}`}
          onChange={(e) => handleOnChange(e)}
          type={'number'}
          value={qty}
        ></input>
      </div>
      <div
        role={'presentation'}
        onClick={() => setQty(qty + 1)}
        className={styles.iconContainer}
      >
        <AddOutlinedIcon/>
      </div>
    </div>
  );
});

export default AdjustItem;