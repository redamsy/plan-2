import React, { useContext } from "react";
import { IVendorAction, IVendorContext, IVendorState } from "./types/vendorContextTypes";
import { IVendorBody } from "../models/Vendor";

// initial value for the vendor context
export const initialVendorContext: IVendorContext = {
  state: {
    vendors: [],
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
    createNewVendor: async (vendor: IVendorBody) => {},
    updateCurrentVendor: async (vendor: IVendorBody) => {},
    deleteCurrentVendor: async (vendorId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const VendorContext = React.createContext<IVendorContext>(initialVendorContext);

// hook for accessing the vendor state
export const useVendorState = (): IVendorState => {
  const { state } = useContext(VendorContext);
  return state;
};
// hook for accessing the vendor actions
export const useVendorActions = (): IVendorAction => {
  const { actions } = useContext(VendorContext);
  return actions;
};
