import React, { useContext } from "react";
import { ISubCategoryAction, ISubCategoryContext, ISubCategoryState } from "./types/subCategoryContextTypes";
import { ISubCategoryBody } from "../models/SubCategory";

// initial value for the subCategory context
export const initialSubCategoryContext: ISubCategoryContext = {
  state: {
    subCategories: [],
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
    createNewSubCategory: async (subCategory: ISubCategoryBody) => {},
    updateCurrentSubCategory: async (subCategory: ISubCategoryBody) => {},
    deleteCurrentSubCategory: async (subCategoryId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const SubCategoryContext = React.createContext<ISubCategoryContext>(initialSubCategoryContext);

// hook for accessing the subCategory state
export const useSubCategoryState = (): ISubCategoryState => {
  const { state } = useContext(SubCategoryContext);
  return state;
};
// hook for accessing the subCategory actions
export const useSubCategoryActions = (): ISubCategoryAction => {
  const { actions } = useContext(SubCategoryContext);
  return actions;
};
