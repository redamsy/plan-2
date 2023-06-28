import { ISubCategoryBody, SubCategory } from "../../models/SubCategory";

export interface ISubCategoryState {
  subCategories: SubCategory[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface ISubCategoryAction {
    createNewSubCategory: (subCategory: ISubCategoryBody) => Promise<void>;
    updateCurrentSubCategory: (subCategory: ISubCategoryBody) => Promise<void>;
    deleteCurrentSubCategory: (subCategoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface ISubCategoryContext {
  state: ISubCategoryState;
  actions: ISubCategoryAction;
}
