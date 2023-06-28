import React, { memo } from 'react';
import styles from './ProductCardGrid.module.css';

import ProductCard from '../ProductCard';
import Slider from '../Slider';
import { Product } from '../../models/Product';

interface Props {
    height?: number | string;
    columns?: number;
    data: Product[];
    spacing?: boolean;
    showSlider?: boolean;
}

const ProductCardGrid = memo((props: Props) => {
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
          description={product.description}
          image={product.image.url}
          originalPrice={product.originalPrice}
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
        {/* this is not used choice for the client if he wants to scroll verticlly or horizantally */}
      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}
    </div>
  );
});

export default ProductCardGrid;