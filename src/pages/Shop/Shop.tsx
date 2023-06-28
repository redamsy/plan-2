import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import styles from './Shop.module.css';

import Banner from '../../components/Banner';
import BreadCrumbs from '../../components/BreadCrumbs';
import CardController, { Filter } from '../../components/CardController';
import Container from '../../components/Container';
import Layout from '../../components/Layout';
import LayoutOption from '../../components/LayoutOption';
import ProductCardGrid from '../../components/ProductCardGrid';
import { useProductState } from '../../context/productsContext';
import CircularProgressPage from '../../components/CircularProgressPage';
import Pagination from '@mui/material/Pagination';
import { generateFilteredProducts } from '../../utils';
import { useParams } from 'react-router-dom';

const Shop = () => {
  const { categoryparam, subcategoryparam } = useParams();
  const [showFilter, setShowFilter] = useState(false);
  const { detailedProducts, loadingData } = useProductState();

  const [filteredDetailedProducts, setFilteredDetailedProducts] = useState(detailedProducts);

  // start of pagination logic
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(6); // Number of items to display per page

  const { totalItems, totalPages, startIndex, endIndex, displayedProducts } = useMemo(() => {
    const totalItems = filteredDetailedProducts.length; // Total number of items in the array
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Total number of pages
    const startIndex = (currentPage - 1) * itemsPerPage; // Index of the first item to display on the current page
    const endIndex = startIndex + itemsPerPage; // Index of the last item to display on the current page
    const displayedProducts = filteredDetailedProducts.slice(startIndex, endIndex); // Array of products to display on the current page
  
    return { totalItems, totalPages, startIndex, endIndex, displayedProducts };
  }, [filteredDetailedProducts, currentPage, itemsPerPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  // end of pagination logic

  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  const escapeHandler = (e: KeyboardEvent) => {
    if (e?.code === undefined) return;
    if (e.code === 'Escape') setShowFilter(false);
  };

  const onclose = (name: string) => {
    //remove this chip name filter and close it
  }
  // const handleSort = () => {
  //   const sortedResult = [...filteredDetailedProducts].sort((a, b) => a.title.localeCompare(b.title));
  //   setFilteredDetailedProducts(sortedResult);
  // };
  const applyFilter = useCallback((filterState: Filter[]) => {
    const filtered = generateFilteredProducts(filterState, detailedProducts);
    setFilteredDetailedProducts(filtered);
  }, [detailedProducts]);

  return (
    <Layout>
      {loadingData ? (
        <CircularProgressPage />
      ) : (
        <div className={styles.root}>
          <Container size={'large'} spacing={'min'}>
            <div className={styles.breadcrumbContainer}>
              <BreadCrumbs
                crumbs={categoryparam ? [
                  { link: '/', label: 'Home' },
                  { link: '/', label: categoryparam },
                ] : [
                  { link: '/', label: 'Home' },
                ]}
              />
            </div>
          </Container>
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
              <div className={styles.controllerContainer}>
                <div
                  className={styles.iconContainer}
                  role={'presentation'}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <TuneOutlinedIcon />
                  <span>Filters</span>
                </div>
                <div
                  className={`${styles.iconContainer} ${styles.sortContainer}`}
                >
                  <span>Sort by</span>
                  <ExpandMoreOutlinedIcon />
                </div>
              </div>
            </div>
            <CardController
              categoryparam={categoryparam}
              totalResult={displayedProducts.length}
              applyFilter={applyFilter}
              closeFilter={() => setShowFilter(false)}
              visible={showFilter}
            />
            {/* <div className={styles.chipsContainer}>
              <Chip name={'XS'} close={onclose}/>
              <Chip name={'S'} close={onclose}/>
            </div> */}
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

      <LayoutOption />
    </Layout>
  );
};

export default Shop;