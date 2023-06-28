import React, { useContext } from "react";
import { ISizeAction, ISizeContext, ISizeState } from "./types/sizeContextTypes";
import { ISizeBody } from "../models/Size";

// initial value for the size context
export const initialSizeContext: ISizeContext = {
  state: {
    sizes: [],
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
    createNewSize: async (size: ISizeBody) => {},
    updateCurrentSize: async (size: ISizeBody) => {},
    deleteCurrentSize: async (sizeId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const SizeContext = React.createContext<ISizeContext>(initialSizeContext);

// hook for accessing the size state
export const useSizeState = (): ISizeState => {
  const { state } = useContext(SizeContext);
  return state;
};
// hook for accessing the size actions
export const useSizeActions = (): ISizeAction => {
  const { actions } = useContext(SizeContext);
  return actions;
};
