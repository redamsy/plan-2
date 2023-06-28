import React, { memo } from 'react';
import styles from './ProductCard.module.css';
import CurrencyAndRateFormatter from '../CurrencyAndRateFormatter';
import { extractImageSrcFromUrlAsUC } from '../../utils';
import { useAuthState } from '../../context/authContext';

var NotFoundImage = require('../../static/not-found.png');

interface Props {
  id: string;
  itemCode: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  height?: number | string;
}
const ProductCard = memo((props: Props) => {
  const { userProfile} = useAuthState();
  const {
    id,
    itemCode,
    image,
    title,
    price,
    originalPrice,
    height = 580,
  } = props;

  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        role={'presentation'}
      >
        <img style={{ height: `${height}px` }} src={extractImageSrcFromUrlAsUC(image) || NotFoundImage} alt={title}></img>
      </div>
      <div className={styles.detailsContainer}>
        <span className={styles.productName}>{title}</span>
        <div className={styles.prices}>
          <span
            className={`${originalPrice !== undefined ? styles.salePrice : ''}`}
          >
            <CurrencyAndRateFormatter currency ={userProfile?.currency} rate ={userProfile?.rate} amount={price} showOriginalCurrency/>
          </span>
          {originalPrice && (
            <span className={styles.originalPrice}>
              <CurrencyAndRateFormatter currency ={userProfile?.currency} rate ={userProfile?.rate} amount={originalPrice} showOriginalCurrency/>
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;