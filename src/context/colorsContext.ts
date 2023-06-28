import React, { useContext } from "react";
import { IColorAction, IColorContext, IColorState } from "./types/colorContextTypes";
import { IColorBody } from "../models/Color";

// initial value for the color context
export const initialColorContext: IColorContext = {
  state: {
    colors: [],
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
    createNewColor: async (color: IColorBody) => {},
    updateCurrentColor: async (color: IColorBody) => {},
    deleteCurrentColor: async (colorId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const ColorContext = React.createContext<IColorContext>(initialColorContext);

// hook for accessing the color state
export const useColorState = (): IColorState => {
  const { state } = useContext(ColorContext);
  return state;
};
// hook for accessing the color actions
export const useColorActions = (): IColorAction => {
  const { actions } = useContext(ColorContext);
  return actions;
};
