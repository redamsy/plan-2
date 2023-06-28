import { ISizeBody, Size } from "../../models/Size";

export interface ISizeState {
  sizes: Size[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface ISizeAction {
    createNewSize: (subCategory: ISizeBody) => Promise<void>;
    updateCurrentSize: (subCategory: ISizeBody) => Promise<void>;
    deleteCurrentSize: (subCategoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface ISizeContext {
  state: ISizeState;
  actions: ISizeAction;
}
