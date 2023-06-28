import React, { useContext, memo } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AddItemNotificationContext from '../../providers/AddItemNotificationProvider';

import Button from '../Button';

import styles from './AddNotification.module.css';
import { Link } from 'react-router-dom';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

const AddNotification = memo((props : { openCart: () => void }) => {
  const sampleCartItem = {
    image: 'https://drive.google.com/file/d/16Wx4l9tIC_E6bVafKm7wgI6CYPT1PzdH/view?usp=drive_link',
    alt: '',
    name: 'Lambswool Crew Neck Jumper',
    price: 220,
    color: 'Anthracite Melange',
    size: 'XS',
  };

  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotif = ctxAddItemNotification.state?.open;

  return (
    <div
      className={`${styles.root} ${
        showNotif === true ? styles.show : styles.hide
      }`}
    >
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <CheckCircleOutlineOutlinedIcon/>
        </div>
        <span>Item added to bag</span>
      </div>

      <div className={styles.newItemContainer}>
        <div className={styles.imageContainer}>
          <img alt={sampleCartItem.alt} src={extractImageSrcFromUrlAsUC(sampleCartItem.image) || NotFoundImage} />
        </div>
        <div className={styles.detailContainer}>
          <span className={styles.name}>{sampleCartItem.name}</span>
          <span className={styles.meta}>Color: {sampleCartItem.color}</span>
          <span className={styles.meta}>Size: {sampleCartItem.size}</span>
        </div>
      </div>

      <div className={styles.actionContainer}>
        <Button onClick={props.openCart} level={'secondary'}>
          view my bag (1)
        </Button>
        <Button level="primary" href="/cart">
          checkout
        </Button>
        <div className={styles.linkContainer}>
          <Link to={'/shop'}>continue shopping</Link>
        </div>
      </div>
    </div>
  );
});

export default AddNotification;