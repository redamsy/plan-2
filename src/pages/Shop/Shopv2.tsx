import React, { useEffect, useMemo, useState } from 'react';
import styles from './ShopV2.module.css';
import { useParams } from 'react-router-dom';

import Accordion from '../../components/Accordion';
import Banner from '../../components/Banner';
import BreadCrumbs from '../../components/BreadCrumbs';
import Checkbox from '../../components/Checkbox';
import Container from '../../components/Container';
import Layout from '../../components/Layout';
import LayoutOption from '../../components/LayoutOption';
import ProductCardGrid from '../../components/ProductCardGrid';

import { useProductState } from '../../context/productsContext';
import CircularProgressPage from '../../components/CircularProgressPage';
import Pagination from '@mui/material/Pagination';
import { Filter } from '../../components/CardController';
import { generateFilteredProducts } from '../../utils';
import { CategoriesWithSub } from '../../models/Product';
import { Color } from '../../models/Color';
import { Size } from '../../models/Size';


const initializeFilterState = (
  categoriesWithSubFilters: CategoriesWithSub[],
  colorFilters: Color[],
  sizeFilters: Size[],
  categoryparam: string | undefined
): Filter[] => {
  const updatedCategoriesItems = categoriesWithSubFilters.map((el) => ({
    name: el.category.name,
    value: el.category.name === categoryparam
  }));

  // array same as shop page
  return [
    {
      category: 'categories',
      items: updatedCategoriesItems,
    },
    {
      category: 'sizes',
      items: sizeFilters.map((el) => ({ name: el.name, value: false })),
    },
    {
      category: 'colors',
      items: colorFilters.map((el) => ({ name: el.name, value: false })),
    }
  ];
};

const ShopV2Page = () => {
  const { categoryparam, subcategoryparam } = useParams();
  const { detailedProducts, loadingData, categoriesWithSubFilters, sizeFilters, colorFilters } = useProductState();

  const [filterState, setFilterState] = useState<Filter[]>(initializeFilterState(categoriesWithSubFilters, colorFilters, sizeFilters, categoryparam));

  useEffect(() => {
    setFilterState(initializeFilterState(categoriesWithSubFilters, colorFilters, sizeFilters, categoryparam));
  }, [categoryparam, categoriesWithSubFilters, colorFilters, sizeFilters]);

  const filteredDetailedProducts = useMemo(() => generateFilteredProducts(filterState, detailedProducts), [filterState, detailedProducts]);

  // start of pagination logic
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(9); // Number of items to display per page

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

  const filterTick = (e: React.ChangeEvent<HTMLInputElement>, categoryIndex: number, labelIndex: number) => {
    const filterStateCopy = [...filterState];
    filterStateCopy[categoryIndex].items[labelIndex].value = e.target.checked;
    setFilterState(filterStateCopy);
  };

  return (
    <Layout>
      {loadingData ? (
        <CircularProgressPage />
      ) : (
        <div className={styles.root}>
          <Container size={'large'} spacing={'min'}>
            <BreadCrumbs
              crumbs={categoryparam ? [
                { link: '/', label: 'Home' },
                { link: '/', label: categoryparam },
              ] : [
                { link: '/', label: 'Home' },
              ]}
            />
          </Container>
          <Banner
            maxWidth={'650px'}
            name={`Woman`}
            subtitle={
              'Look to our women’s sweaters for modern takes on one-and-done dressing. From midis in bold prints to dramatic floor-sweeping styles and easy all-in-ones, our edit covers every mood.'
            }
          />
          <Container size={'large'} spacing={'min'}>
            <div className={styles.content}>
              <div className={styles.filterContainer}>
                {filterState.map((category, categoryIndex) => {
                  return (
                    <div key={categoryIndex}>
                      <Accordion customStyle={styles} title={category.category}>
                        {category.items.map((item, itemIndex) => {
                          return (
                            <div key={itemIndex} className={styles.filters}>
                              <Checkbox
                                size={'sm'}
                                action={(e) =>
                                  filterTick(e, categoryIndex, itemIndex)
                                }
                                label={item.name}
                                value={item.name}
                                isChecked={item.value}
                                id={item.name}
                                name={item.name}
                              />
                            </div>
                          );
                        })}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
              <div>
                <div className={styles.metaContainer}>
                  <span className={`standardSpan`}>{totalItems} items</span>
                </div>
                <ProductCardGrid height={'440px'} data={displayedProducts}></ProductCardGrid>
              </div>
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

export default ShopV2Page;