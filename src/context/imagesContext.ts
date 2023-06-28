import React, { useContext } from "react";
import { IImageAction, IImageContext, IImageState } from "./types/imageContextTypes";
import { IImageBody } from "../models/Image";

// initial value for the image context
export const initialImageContext: IImageContext = {
  state: {
    images: [],
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
    createNewImage: async (image: IImageBody) => {},
    updateCurrentImage: async (image: IImageBody) => {},
    deleteCurrentImage: async (imageId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const ImageContext = React.createContext<IImageContext>(initialImageContext);

// hook for accessing the image state
export const useImageState = (): IImageState => {
  const { state } = useContext(ImageContext);
  return state;
};
// hook for accessing the image actions
export const useImageActions = (): IImageAction => {
  const { actions } = useContext(ImageContext);
  return actions;
};
