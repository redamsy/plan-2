import React, { memo } from 'react';
import styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';
import CircularProgressPage from '../CircularProgressPage';
import { useCategoryState } from '../../context/categoriesContext';

const ProductCollectionGrid = memo(() => {
  const { loadingData, categories } = useCategoryState();
  return (
    <div className={styles.root}>
      {loadingData ? (
        <CircularProgressPage />
      ) : 
        categories.map((category, index) => (
          <ProductCollection
            key={index}
            image={category.image?.url}
            title={category.name}
            text={'SHOP NOW'}
            link={`/shop/${category.name}`}
          />
        ))
      }
    </div>
  );
});

export default ProductCollectionGrid;