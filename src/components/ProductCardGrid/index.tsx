import React, { useState, memo } from 'react';
import styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';
import { DetailedProduct } from '../../models/Product';

interface Props {
    height?: number | string;
    columns?: number;
    data: DetailedProduct[];
    spacing?: boolean;
    showSlider?: boolean;
}

const ProductCardGrid = memo((props: Props) => {
  const [showQuickView, setShowQuickView] = useState<DetailedProduct | undefined>(undefined);
  const { height, columns = 3, data, spacing, showSlider = false } = props;
  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const renderCards = () => {
    return data.map((product, index) => {
      return (
        <ProductCard
          key={index}
          id={product.id}
          itemCode={product.itemCode}
          height={height}
          price={product.price}
          title={product.title}
          image={product.image.url}
          originalPrice={product.originalPrice}
          showQuickView={() => setShowQuickView(product)}
        />
      );
    });
  };

  return (
    <div className={styles.root} style={columnCount}>
      <div
        className={`${styles.cardGrid} ${
          showSlider === false ? styles.show : ''
        }`}
        style={columnCount}
      >
        {data && renderCards()}
      </div>

      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}

      {!!showQuickView && (
        <Drawer visible={!!showQuickView} close={() => setShowQuickView(undefined)}>
          <QuickView detailedProduct={showQuickView}  close={() => setShowQuickView(undefined)} />
        </Drawer>
      )}
    </div>
  );
});

export default ProductCardGrid;