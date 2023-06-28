import React, { memo } from 'react';

import CloseIcon from "@mui/icons-material/Close";
import styles from './RemoveItem.module.css';

const RemoveItem = memo(() => {
  return (
    <div className={styles.root}>
      <CloseIcon/>
    </div>
  );
});

export default RemoveItem;