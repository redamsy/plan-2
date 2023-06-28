import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import AdjustItem from '../AdjustItem';
import CurrencyFormatter from '../CurrencyFormatter';
import RemoveItem from '../RemoveItem';

import styles from './MiniCartItem.module.css';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

const MiniCartItem = memo((props: {
    image: string;
    alt: string;
    name: string;
    price: number;
    color: string;
    size: string;
}) => {
    const navigate = useNavigate();
  const { image, alt, name, price, color, size } = props;

  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        role={'presentation'}
        onClick={() => navigate('/product/sample')}
      >
        <img src={extractImageSrcFromUrlAsUC(image) || NotFoundImage} alt={alt} />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.metaContainer}>
          <span className={styles.name}>{name}</span>
          <div className={styles.priceContainer}>
            <CurrencyFormatter amount={price} />
          </div>
          <span className={styles.meta}>Color: {color}</span>
          <span className={styles.meta}>
            Size:
            <span className={styles.size}>{size}</span>
          </span>
        </div>
        <div className={styles.adjustItemContainer}>
          <AdjustItem />
        </div>
      </div>
      <div className={styles.closeContainer}>
        <RemoveItem />
      </div>
    </div>
  );
});

export default MiniCartItem;