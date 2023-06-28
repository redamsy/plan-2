import { IProductBody, Product } from "../../models/Product";

export interface IProductState {
  products: Product[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface IProductAction {
    createNewProduct: (product: IProductBody) => Promise<void>;
    updateCurrentProduct: (product: IProductBody) => Promise<void>;
    deleteCurrentProduct: (productId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface IProductContext {
  state: IProductState;
  actions: IProductAction;
}
