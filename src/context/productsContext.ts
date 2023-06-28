import React, { useContext } from "react";
import { IProductAction, IProductContext, IProductState } from "./types/productContextTypes";
import { IProductBody } from "../models/Product";

// initial value for the product context
export const initialProductContext: IProductContext = {
  state: {
    products: [],
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
    createNewProduct: async (product: IProductBody) => {},
    updateCurrentProduct: async (product: IProductBody) => {},
    deleteCurrentProduct: async (productId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const ProductContext = React.createContext<IProductContext>(initialProductContext);

// hook for accessing the product state
export const useProductState = (): IProductState => {
  const { state } = useContext(ProductContext);
  return state;
};
// hook for accessing the product actions
export const useProductActions = (): IProductAction => {
  const { actions } = useContext(ProductContext);
  return actions;
};
