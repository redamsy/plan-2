import { IPageBody, Page } from "../../models/Page";

export interface IPageState {
  pages: Page[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface IPageAction {
    createNewPage: (subCategory: IPageBody) => Promise<void>;
    updateCurrentPage: (subCategory: IPageBody) => Promise<void>;
    deleteCurrentPage: (subCategoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface IPageContext {
  state: IPageState;
  actions: IPageAction;
}
