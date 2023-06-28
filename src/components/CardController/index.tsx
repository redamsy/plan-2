import React, { useEffect, useState, memo } from 'react';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import Container from '../Container';
import Checkbox from '../Checkbox';
import styles from './CardController.module.css';
import Button from '../Button';
import Drawer from '../Drawer';
import { useProductState } from '../../context/productsContext';
import { useParams } from 'react-router-dom';
import { CategoriesWithSub } from '../../models/Product';
import { Color } from '../../models/Color';
import { Size } from '../../models/Size';

interface FilterWithIndex extends Filter {
    categoryIndex: number;
}
export interface Filter {
    category: 'categories' | 'sizes' | 'colors';
    items: {
        name: string;
        value: boolean;
    }[];
}
interface Props {
    categoryparam?: string;
    totalResult: number;
    visible: boolean;
    closeFilter: () => void;
    applyFilter: (filterState: Filter[]) => void;
}

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

const CardController = memo(({categoryparam, totalResult, visible, closeFilter, applyFilter}: Props) => {
  const { categoriesWithSubFilters, sizeFilters, colorFilters } = useProductState();
  const [category, setCategory] = useState<FilterWithIndex>();

  const [filterState, setFilterState] = useState<Filter[]>(
    initializeFilterState(categoriesWithSubFilters, colorFilters, sizeFilters, categoryparam)
    );

  const filterTick = (e: React.ChangeEvent<HTMLInputElement>, categoryIndex: number, labelIndex: number) => {
    const filterStateCopy = [...filterState];
    filterStateCopy[categoryIndex].items[labelIndex].value = e.target.checked;
    setFilterState(filterStateCopy);
  };

  const resetFilter = () => {
    const filterStateCopy = [...filterState];
    for (let x = 0; x < filterStateCopy.length; x++) {
      for (let y = 0; y < filterStateCopy[x].items.length; y++) {
        filterStateCopy[x].items[y].value = false;
      }
    }
    setFilterState(filterStateCopy);
  };

  useEffect(() => {
    const newFilterState = initializeFilterState(categoriesWithSubFilters, colorFilters, sizeFilters, categoryparam);
    setFilterState(newFilterState);
    applyFilter(newFilterState);

    //category state it is not updating
    //back around to commented code below
    // we need to to show the 'root filter drawer(<div className={styles.mobileFilters}>)'
    setCategory(undefined)
    //react_devtools_backend_compact.js:2367 Warning: Maximum update depth exceeded.
    //This can happen when a component calls setState inside useEffect,
    //but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    // if(category){
    //   if(category.category === 'categories') {
    //     const filterItem = newFilterState.find((nf, index) => nf.category === 'categories');
    //     const filterItemIndex = newFilterState.findIndex((nf) => nf.category === 'categories');
    //     if(filterItem) {
    //       setCategory({
    //         ...filterItem,
    //         categoryIndex: filterItemIndex,
    //       });
    //     }
    //   }
    // }
  }, [categoryparam, categoriesWithSubFilters, colorFilters, sizeFilters, applyFilter]);

  return (
    <div>
      <div
        className={`${styles.webRoot} ${
          visible === true ? styles.show : styles.hide
        }`}
      >
        <Container>
          <div className={styles.filterContainer}>
            {filterState &&
              filterState.map((filter, categoryIndex) => {
                // if number of filter per category is less than 4 maintain single layout
                const colNum = filter.items.length >= 4 ? 2 : 1;
                return (
                  <div key={`category-${categoryIndex}`}>
                    <span className={styles.category}>{filter.category}</span>
                    <div
                      className={styles.nameContainers}
                      style={{ gridTemplateColumns: `repeat(${colNum}, 1fr)` }}
                    >
                      {filter.items &&
                        filter.items.map((item, itemIndex) => (
                          <Checkbox
                            key={itemIndex}
                            action={(e) =>
                              filterTick(e, categoryIndex, itemIndex)
                            }
                            label={item.name}
                            value={item.name}
                            id={item.name}
                            name={item.name}
                            isChecked={item.value}
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </Container>
        <div className={styles.actionContainer}>
          <Button
            onClick={() => {
              applyFilter(filterState);
              closeFilter();
              return;
            }}
            className={styles.customButtonStyling}
            level={'primary'}
          >
            view items
          </Button>
          <Button
            onClick={closeFilter}
            className={styles.customButtonStyling}
            level={'secondary'}
          >
            close
          </Button>
        </div>
      </div>
      <div className={styles.mobileRoot}>
        <Drawer visible={visible} close={closeFilter}>
          <div className={styles.mobileFilterContainer}>
            <h2 className={styles.mobileFilterTitle}>Filters</h2>

            {category === undefined && (
              <div className={styles.mobileFilters}>
                {filterState?.map((filterItem, categoryIndex) => {
                  return (
                    <div
                      key={categoryIndex}
                      className={styles.filterItemContainer}
                      role={'presentation'}
                      onClick={() =>
                        setCategory({
                          ...filterItem,
                          categoryIndex: categoryIndex,
                        })
                      }
                    >
                      <span className={styles.filterName}>
                        {filterItem.category}
                      </span>
                      <ArrowRightAltOutlinedIcon/>
                    </div>
                  );
                })}
              </div>
            )}

            {category !== undefined && (
              <div className={styles.mobileCategoryContainer}>
                <div
                  className={styles.mobileHeader}
                  role={'presentation'}
                  onClick={() => setCategory(undefined)}
                >
                  <ArrowRightAltOutlinedIcon/>
                  <span className={styles.mobileCategory}>
                    {category.category}
                  </span>
                </div>
                {category.items.map((item, itemIndex) => {
                  return (
                    <Checkbox
                      key={itemIndex}
                      action={(e) =>
                        filterTick(e, category.categoryIndex, itemIndex)
                      }
                      label={item.name}
                      value={item.name}
                      id={item.name}
                      name={item.name}
                      isChecked={item.value}
                    />
                  );
                })}
              </div>
            )}

            <div className={styles.mobileButtonContainer}>
              {category === undefined && (
                <Button
                onClick={() => {
                  applyFilter(filterState);
                  closeFilter();
                  return;
                }}
                fullWidth
                level={'primary'}
              >
                  {`show results: ${totalResult}`}
                </Button>
              )}
              {category !== undefined && (
                <div>
                  <Button
                    onClick={() => {
                      applyFilter(filterState);
                      closeFilter();
                      return;
                    }}
                    fullWidth level={'primary'}
                  >
                    Apply
                  </Button>
                  <div
                    className={styles.clearFilterContainer}
                    role={'presentation'}
                    onClick={() => resetFilter()}
                  >
                    <span className={styles.clearFilter}>clear filters</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
});

export default CardController;