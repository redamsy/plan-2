import { IVendorBody, Vendor } from "../../models/Vendor";

export interface IVendorState {
  vendors: Vendor[];
  loadingData: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createError: string;
  updateError: string;
  deleteError: string;
  openSnack: boolean;
}

export interface IVendorAction {
    createNewVendor: (subCategory: IVendorBody) => Promise<void>;
    updateCurrentVendor: (subCategory: IVendorBody) => Promise<void>;
    deleteCurrentVendor: (subCategoryId: string) => Promise<void>;
    clearErrorsAndCloseSnack: () => void;
}

export interface IVendorContext {
  state: IVendorState;
  actions: IVendorAction;
}
