import React, { useState, useMemo,  } from 'react';
import styles from './Shop.module.css';

import Banner from '../../components/Banner';
import Container from '../../components/Container';
import Layout from '../../components/Layout';
import ProductCardGrid from '../../components/ProductCardGrid';
import { useProductState } from '../../context/productsContext';
import CircularProgressPage from '../../components/CircularProgressPage';
import Pagination from '@mui/material/Pagination';

const Shop = () => {
  const { products, loadingData } = useProductState();

  // start of pagination logic
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(6); // Number of items to display per page

  const { totalItems, totalPages, startIndex, endIndex, displayedProducts } = useMemo(() => {
    const totalItems = products.length; // Total number of items in the array
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Total number of pages
    const startIndex = (currentPage - 1) * itemsPerPage; // Index of the first item to display on the current page
    const endIndex = startIndex + itemsPerPage; // Index of the last item to display on the current page
    const displayedProducts = products.slice(startIndex, endIndex); // Array of products to display on the current page
  
    return { totalItems, totalPages, startIndex, endIndex, displayedProducts };
  }, [products, currentPage, itemsPerPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  // end of pagination logic

  return (
    <Layout>
      {loadingData ? (
        <CircularProgressPage />
      ) : (
        <div className={styles.root}>
          <Banner
            maxWidth={'650px'}
            name={`Woman's Sweaters`}
            subtitle={
              'Look to our women’s sweaters for modern takes on one-and-done dressing. From midis in bold prints to dramatic floor-sweeping styles and easy all-in-ones, our edit covers every mood.'
            }
          />
          <Container size={'large'} spacing={'min'}>
            <div className={styles.metaContainer}>
              <span className={styles.itemCount}>{totalItems} items</span>
            </div>
            <div className={styles.productContainer}>
              <span className={styles.mobileItemCount}>{totalItems} items</span>
              <ProductCardGrid data={displayedProducts}></ProductCardGrid>
            </div>
            <div className={styles.loadMoreContainer}>
              <span>{`${displayedProducts.length} of ${totalItems}`}</span>
              <Pagination
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
                variant="outlined"
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                disabled={totalPages === 0} // Disable the pagination if there are no pages
              />
            </div>
          </Container>
        </div>
      )}
    </Layout>
  );
};

export default Shop;