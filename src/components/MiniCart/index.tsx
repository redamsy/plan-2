import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../Button';
import CurrencyFormatter from '../CurrencyFormatter';
import MiniCartItem from '../MiniCartItem';

import styles from './MiniCart.module.css';

const MiniCart = memo(() => {
  const navigate = useNavigate();
  // TODO: need new table cart(userId, productId, galleryId(optional))
  const sampleCartItem = {
    image: 'https://drive.google.com/file/d/16Wx4l9tIC_E6bVafKm7wgI6CYPT1PzdH/view?usp=drive_link',
    alt: '',
    name: 'Lambswool Crew Neck Jumper',
    price: 220,
    color: 'Anthracite Melange',
    size: 'xs',
  };

  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>My Bag</h4>
      </div>
      <div className={styles.cartItemsContainer}>
        <MiniCartItem {...sampleCartItem} />
      </div>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryContent}>
          <div className={styles.totalContainer}>
            <span>Total (USD)</span>
            <span>
              <CurrencyFormatter amount={220} appendZero />
            </span>
          </div>
          <span className={styles.taxNotes}>
            Taxes and shipping will be calculated at checkout
          </span>
          <Button onClick={() => navigate('/cart')} level={'primary'} fullWidth>
            checkout
          </Button>
          <div className={styles.linkContainer}>
            <Link to={'/shop'}>continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MiniCart;