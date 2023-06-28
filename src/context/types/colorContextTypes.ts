import { IColorBody, Color } from "../../models/Color";

export interface IColorState {
  colors: Color[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface IColorAction {
    createNewColor: (subCategory: IColorBody) => Promise<void>;
    updateCurrentColor: (subCategory: IColorBody) => Promise<void>;
    deleteCurrentColor: (subCategoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface IColorContext {
  state: IColorState;
  actions: IColorAction;
}
