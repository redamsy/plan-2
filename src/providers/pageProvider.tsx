import React, {
    useCallback,
    ReactNode,
    useEffect,
    useState,
    useMemo,
  } from "react";
  import { IPageBody, Page } from "../models/Page";
  import {
    createPage,
    deletePage,
    getPages,
    updatePage,
  } from "../actions/page";
  import CircularProgressPage from "../components/CircularProgressPage";
  import { PageContext, initialPageContext } from "../context/pagesContext";
  
  export const PageProvider = ({ children }: { children: ReactNode }) => {
  
    const [pages, setPages] = useState<Page[]>(initialPageContext.state.pages);
    const [loadingData, setLoadingData] = useState<boolean>(initialPageContext.state.loadingData);
    const [isCreating, setIsCreating] = useState<boolean>(initialPageContext.state.isCreating);
    const [isUpdating, setIsUpdating] = useState<boolean>(initialPageContext.state.isUpdating);
    const [isDeleting, setIsDeleting] = useState<boolean>(initialPageContext.state.isDeleting);
    const [createError, setCreateError] = useState<string>(
      initialPageContext.state.createError
    );
    const [updateError, setUpdateError] = useState<string>(
      initialPageContext.state.updateError
    );
    const [deleteError, setDeleteError] = useState<string>(
      initialPageContext.state.deleteError
    );
    const [openSnack, setOpenSnack] = useState(initialPageContext.state.openSnack);
  
    useEffect(() => {
      const fetchPages = async () => {
        try {
          setLoadingData(true);
          const res = await getPages();
          console.log("pageProvider: res.data", res.data);
          setPages(res.data);
          setLoadingData(false);
        } catch (error: Error | any) {
          setLoadingData(false);
        }
      };
  
      fetchPages();
    }, []);
  
    const clearErrorsAndCloseSnack = useCallback(() => {
      setCreateError("");
      setUpdateError("");
      setDeleteError("");
      setOpenSnack(false);
    }, [])
  
    const createNewPage = useCallback(async (pageBody: IPageBody) => {
      try {
        clearErrorsAndCloseSnack();
        setIsCreating(true);
        const createResponse = await createPage(pageBody);
        console.log("pageProvider: createNewPage", createResponse);
        const { status, data: page } = createResponse;
  
        if (page && status === 201) {
  
          setPages([...pages, page]);
  
          setIsCreating(false);
          setCreateError("");
          setOpenSnack(true);
  
        } else {
          setIsCreating(false);
          setCreateError(`Create page faild: ${createResponse.status}`);
          setOpenSnack(true);
        }
      } catch (error: Error | any) {
        setIsCreating(false);
        if(error?.response && error?.response?.data && error?.response?.data?.message){
          setCreateError(`Create page faild: ${error.response.data.message}`);
        } else {
          setCreateError(`Create page faild: ${error.message}`);
        }
        setOpenSnack(true);
      }
    }, [pages, clearErrorsAndCloseSnack]);
  
    const updateCurrentPage = useCallback(async (pageBody: IPageBody) => {
      try {
        clearErrorsAndCloseSnack();
        setIsUpdating(true);
        const updateResponse = await updatePage(pageBody);
        console.log("pageProvider: updateCurrentPage", updateResponse);
        const { status, data: page } = updateResponse;
        if (page && status === 200) {
  
  
          setPages((prevPages) =>{
            return prevPages.map((p) => (p.id === page.id ? page : p));
          });
  
          setIsUpdating(false);
          setUpdateError("");
          setOpenSnack(true);
  
        } else {
          setIsUpdating(false);
          setUpdateError(`Update page faild: ${updateResponse.status}`);
          setOpenSnack(true);
        }
      } catch (error: Error | any) {
        setIsUpdating(false);
        if(error?.response && error?.response?.data && error?.response?.data?.message){
          setUpdateError(`Update page faild: ${error.response.data.message}`);
        } else {
          setUpdateError(`Update page faild: ${error.message}`);
        }
        setOpenSnack(true);
      }
    }, [clearErrorsAndCloseSnack]);
  
    const deleteCurrentPage = useCallback(async (pageId: string) => {
      try {
        clearErrorsAndCloseSnack();
        setIsDeleting(true);
        const deleteResponse = await deletePage(pageId);
        console.log("pageProvider: deleteResponse", deleteResponse);
        if (deleteResponse.status === 200) {
  
          setPages(pages.filter((page) => page.id !== pageId));
  
          setIsDeleting(false);
          setDeleteError("");
          setOpenSnack(true);
  
        } else {
          setIsDeleting(false);
          setDeleteError(`Delete page faild: ${deleteResponse.status}`);
          setOpenSnack(true);
        }
      } catch (error: Error | any) {
        setIsDeleting(false);
        if(error?.response && error?.response?.data && error?.response?.data?.message){
          setDeleteError(`Delete page faild: ${error.response.data.message}`);
        } else {
          setDeleteError(`Delete page faild: ${error.message}`);
        }
        setOpenSnack(true);
      }
    }, [pages, clearErrorsAndCloseSnack]);
  
    const pageContext = useMemo(
      () => ({
        state: {
          pages,
          loadingData,
          isCreating,
          isUpdating,
          isDeleting,
          createError,
          updateError,
          deleteError,
          openSnack,
        },
        actions: { createNewPage, updateCurrentPage, deleteCurrentPage, clearErrorsAndCloseSnack },
      }),
      [
        createNewPage,
        updateCurrentPage,
        deleteCurrentPage,
        clearErrorsAndCloseSnack,
        pages,
        isCreating,
        isUpdating,
        isDeleting,
        loadingData,
        createError,
        updateError,
        deleteError,
        openSnack,
      ]
    );
  
    return (
      <PageContext.Provider value={pageContext}>
      {loadingData ? <CircularProgressPage /> : children}
      </PageContext.Provider>
    );
  };
    