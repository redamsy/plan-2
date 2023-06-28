import { IImageBody, Image } from "../../models/Image";

export interface IImageState {
  images: Image[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface IImageAction {
    createNewImage: (subCategory: IImageBody) => Promise<void>;
    updateCurrentImage: (subCategory: IImageBody) => Promise<void>;
    deleteCurrentImage: (subCategoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface IImageContext {
  state: IImageState;
  actions: IImageAction;
}
