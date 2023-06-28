import React, { memo } from 'react';
import styles from './Slider.module.css';
import Slick from 'react-slick';

interface Props {
    spacing?: boolean;
    settings?: {slidesToShow: number};
    children: React.ReactNode;
}

const Slider = memo((props: Props) => {
  const { children, settings, spacing } = props;

  const customPaging = () => {
    return <div className={styles.mobilePagination}></div>;
  };

  const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: `${styles.customDots}`,
    customPaging: customPaging,
  };

  return (
    <div className={`${styles.root} ${spacing === true ? styles.spacing : ''}`}>
      <Slick {...defaultSettings} {...settings}>
        {children}
      </Slick>
    </div>
  );
});

export default Slider;