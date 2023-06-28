import React, { useEffect, useState, memo } from 'react';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import Container from '../Container';
import styles from './CardController.module.css';
import Button from '../Button';
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
    </div>
  );
});

export default CardController;