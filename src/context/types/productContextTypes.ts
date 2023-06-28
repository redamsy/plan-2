import { Color } from "../../models/Color";
import { IProductBody, DetailedProduct, CategoriesWithSub } from "../../models/Product";
import { Size } from "../../models/Size";

export interface IProductState {
  detailedProducts: DetailedProduct[];
  categoriesWithSubFilters: CategoriesWithSub[];
  sizeFilters: Size[];
  colorFilters: Color[];
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
