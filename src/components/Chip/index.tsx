import React, { memo } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import styles from './Chip.module.css';

interface Props {
    name: string;
    close: (name: string) => void;
}
const Chip = memo((props: Props) => {
  const { name, close } = props;
  return (
    <div className={styles.root} role={'presentation'} onClick={() => close(name)}>
      <span>{name}</span>
      <CloseOutlinedIcon/>
    </div>
  );
});

export default Chip;