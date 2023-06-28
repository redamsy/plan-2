import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ISizeBody, Size } from "../models/Size";
import {
  createSize,
  deleteSize,
  getSizes,
  updateSize,
} from "../actions/size";
import CircularProgressPage from "../components/CircularProgressPage";
import { SizeContext, initialSizeContext } from "../context/sizesContext";

export const SizeProvider = ({ children }: { children: ReactNode }) => {

  const [sizes, setSizes] = useState<Size[]>(initialSizeContext.state.sizes);
  const [loadingData, setLoadingData] = useState<boolean>(initialSizeContext.state.loadingData);
  const [isCreating, setIsCreating] = useState<boolean>(initialSizeContext.state.isCreating);
  const [isUpdating, setIsUpdating] = useState<boolean>(initialSizeContext.state.isUpdating);
  const [isDeleting, setIsDeleting] = useState<boolean>(initialSizeContext.state.isDeleting);
  const [createError, setCreateError] = useState<string>(
    initialSizeContext.state.createError
  );
  const [updateError, setUpdateError] = useState<string>(
    initialSizeContext.state.updateError
  );
  const [deleteError, setDeleteError] = useState<string>(
    initialSizeContext.state.deleteError
  );
  const [openSnack, setOpenSnack] = useState(initialSizeContext.state.openSnack);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setLoadingData(true);
        const res = await getSizes();
        console.log("sizeProvider: res.data", res.data);
        setSizes(res.data);
        setLoadingData(false);
      } catch (error: Error | any) {
        setLoadingData(false);
      }
    };

    fetchSizes();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setCreateError("");
    setUpdateError("");
    setDeleteError("");
    setOpenSnack(false);
  }, [])

  const createNewSize = useCallback(async (sizeBody: ISizeBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsCreating(true);
      const createResponse = await createSize(sizeBody);
      console.log("sizeProvider: createNewSize", createResponse);
      const { status, data: size } = createResponse;

      if (size && status === 201) {

        setSizes([...sizes, size]);

        setIsCreating(false);
        setCreateError("");
        setOpenSnack(true);

      } else {
        setIsCreating(false);
        setCreateError(`Create size faild: ${createResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsCreating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setCreateError(`Create size faild: ${error.response.data.message}`);
      } else {
        setCreateError(`Create size faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [sizes, clearErrorsAndCloseSnack]);

  const updateCurrentSize = useCallback(async (sizeBody: ISizeBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateSize(sizeBody);
      console.log("sizeProvider: updateCurrentSize", updateResponse);
      const { status, data: size } = updateResponse;
      if (size && status === 200) {


        setSizes((prevSizes) =>{
          return prevSizes.map((p) => (p.id === size.id ? size : p));
        });

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update size faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update size faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update size faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [clearErrorsAndCloseSnack]);

  const deleteCurrentSize = useCallback(async (sizeId: string) => {
    try {
      clearErrorsAndCloseSnack();
      setIsDeleting(true);
      const deleteResponse = await deleteSize(sizeId);
      console.log("sizeProvider: deleteResponse", deleteResponse);
      if (deleteResponse.status === 200) {

        setSizes(sizes.filter((size) => size.id !== sizeId));

        setIsDeleting(false);
        setDeleteError("");
        setOpenSnack(true);

      } else {
        setIsDeleting(false);
        setDeleteError(`Delete size faild: ${deleteResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsDeleting(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setDeleteError(`Delete size faild: ${error.response.data.message}`);
      } else {
        setDeleteError(`Delete size faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [sizes, clearErrorsAndCloseSnack]);

  const sizeContext = useMemo(
    () => ({
      state: {
        sizes,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
      },
      actions: { createNewSize, updateCurrentSize, deleteCurrentSize, clearErrorsAndCloseSnack },
    }),
    [
      createNewSize,
      updateCurrentSize,
      deleteCurrentSize,
      clearErrorsAndCloseSnack,
      sizes,
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
    <SizeContext.Provider value={sizeContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </SizeContext.Provider>
  );
};
  