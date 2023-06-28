import React, { useContext } from "react";
import { IPageAction, IPageContext, IPageState } from "./types/pageContextTypes";
import { IPageBody } from "../models/Page";

// initial value for the page context
export const initialPageContext: IPageContext = {
  state: {
    pages: [],
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
    createNewPage: async (page: IPageBody) => {},
    updateCurrentPage: async (page: IPageBody) => {},
    deleteCurrentPage: async (pageId: string) => {},
    clearErrorsAndCloseSnack: () => {},
  },
};

export const PageContext = React.createContext<IPageContext>(initialPageContext);

// hook for accessing the page state
export const usePageState = (): IPageState => {
  const { state } = useContext(PageContext);
  return state;
};
// hook for accessing the page actions
export const usePageActions = (): IPageAction => {
  const { actions } = useContext(PageContext);
  return actions;
};
