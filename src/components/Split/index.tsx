import React, { memo } from 'react';
import Button from '../Button';
import styles from './Split.module.css';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

interface Props {
  image: string;
  alt: string;
  title: string; 
  description: string;
  ctaText: string;
  cta: () => void;
  bgColor: string;
}
const Split = memo((props: Props) => {
  const { image, alt, title, description, ctaText, cta, bgColor } = props;
  return (
    <div className={styles.root}>
      <div
        className={styles.contentContainer}
        style={{ backgroundColor: bgColor }}
      >
        <div className={styles.detailContainer}>
          <h4>{title}</h4>
          <p>{description}</p>
          <Button className={styles.button} level={'primary'} onClick={cta}>
            {ctaText}
          </Button>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={extractImageSrcFromUrlAsUC(image) || NotFoundImage} alt={alt}></img>
      </div>
    </div>
  );
});

export default Split;