import { ICategoryBody, Category } from "../../models/Category";

export interface ICategoryState {
  categories: Category[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface ICategoryAction {
    createNewCategory: (category: ICategoryBody) => Promise<void>;
    updateCurrentCategory: (category: ICategoryBody) => Promise<void>;
    deleteCurrentCategory: (categoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface ICategoryContext {
  state: ICategoryState;
  actions: ICategoryAction;
}
