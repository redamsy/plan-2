import React, { memo } from 'react';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import styles from './LayoutOption.module.css';
import { useNavigate } from 'react-router-dom';

const LayoutOption = memo(() => {
    const navigate = useNavigate();
  return (
    <div className={styles.root}>
      <div
        className={styles.layoutIconContainer}
        onClick={() => navigate('/shopv2')}
        role={'presentation'}
      >
        <DragIndicatorOutlinedIcon/>
      </div>
      <div
        className={styles.layoutIconContainer}
        onClick={() => navigate('/shop')}
        role={'presentation'}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <DragIndicatorOutlinedIcon/>
      </div>
    </div>
  );
});

export default LayoutOption;