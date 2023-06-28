import React, { memo } from 'react';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestoreIcon from '@mui/icons-material/Restore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Attribute from '../Attribute';

import styles from './AttributeGrid.module.css';

const AttributeGrid = memo(() => {
  return (
    <div className={styles.root}>
      <Attribute
        icon={() => <DeliveryDiningIcon/>}
        title={'free delivery worldwide'}
        subtitle={'Click to learn more'}
      />
      <Attribute
        icon={() => <RestoreIcon/>}
        title={'returns'}
        subtitle={'Return goods in 30 days'}
      />
      <Attribute
        icon={() => <CreditCardIcon/>}
        title={'secured payment'}
        subtitle={'Shop safely'}
      />
    </div>
  );
});

export default AttributeGrid;