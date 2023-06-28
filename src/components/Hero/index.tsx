import React, { memo } from 'react';
import styles from './Hero.module.css';
import Button from '../Button';
import { Link } from 'react-router-dom';
import { extractImageSrcFromUrlAsUC } from '../../utils';

interface Props {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  image?: string;
  maxWidth?: string;
  ctaStyle?: any;
  ctaLink?: string;
  ctaTo?: string;
  header?: string;
}

var NotFoundImage = require('../../static/not-found.png');

const Hero = memo((props: Props) => {
  const {
    title,
    subtitle,
    ctaText,
    ctaAction,
    image,
    maxWidth,
    ctaStyle,
    ctaLink,
    ctaTo,
    header,
  } = props;

  return (
    <div className={styles.root} style={{ backgroundImage: `url(${extractImageSrcFromUrlAsUC(image) || NotFoundImage})` }}>
      <div className={styles.content} style={{ maxWidth: maxWidth }}>
        {header && <span className={styles.header}>{header}</span>}
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        {ctaText && (
          <Button
            className={`${styles.ctaButton} ${ctaStyle}`}
            level={'primary'}
            onClick={ctaAction}
          >
            {ctaText}
          </Button>
        )}
        {ctaLink && ctaTo && (
          <Link className={styles.ctaLink} to={ctaTo}>
            {ctaLink}
          </Link>
        )}
      </div>
    </div>
  );
});

export default Hero;