import React, { useContext } from "react";
import { ICategoryAction, ICategoryContext, ICategoryState } from "./types/categoryContextTypes";
import { ICategoryBody } from "../models/Category";

// initial value for the category context
export const initialCategoryContext: ICategoryContext = {
  state: {
    categories: [],
    loadingData: true,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: "",
    updateError: "",
    deleteError: "",
    openSnack: false,
  },
  actions: {
    createNewCategory: async (category: ICategoryBody) => {},
    updateCurrentCategory: async (category: ICategoryBody) => {},
    deleteCurrentCategory: async (categoryId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const CategoryContext = React.createContext<ICategoryContext>(initialCategoryContext);

// hook for accessing the category state
export const useCategoryState = (): ICategoryState => {
  const { state } = useContext(CategoryContext);
  return state;
};
// hook for accessing the category actions
export const useCategoryActions = (): ICategoryAction => {
  const { actions } = useContext(CategoryContext);
  return actions;
};
