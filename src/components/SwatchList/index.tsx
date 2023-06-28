import React, { memo } from 'react';

import Swatch from '../Swatch';
import styles from './SwatchList.module.css';
import { Color } from '../../models/Color';

interface Props {
  swatchList: Color[];
  activeSwatch?: Color;
  setActiveSwatch: React.Dispatch<React.SetStateAction<Color | undefined>>
}
const SwatchList = memo((props: Props) => {
  const { swatchList, activeSwatch, setActiveSwatch } = props;
  return (
    <div className={styles.root}>
      <span className={styles.label}>Select Colour: {activeSwatch && activeSwatch.name}</span>
      <div className={styles.swatchSelection}>
        {swatchList?.map((colorChoice, index) => {
          return (
            <Swatch
              key={index}
              data={colorChoice}
              setActiveSwatch={setActiveSwatch}
              isActive={activeSwatch === colorChoice}
            />
          );
        })}
      </div>
    </div>
  );
});

export default SwatchList;