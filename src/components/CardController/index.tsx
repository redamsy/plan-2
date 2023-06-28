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

  return (
    <div>
      <div
        className={`${styles.webRoot} ${
          visible === true ? styles.show : styles.hide
        }`}
      >
        lllllllllllll
      </div>
    </div>
  );
});

export default CardController;