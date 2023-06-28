import React, {
  useCallback,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { IColorBody, Color } from "../models/Color";
import {
  createColor,
  deleteColor,
  getColors,
  updateColor,
} from "../actions/color";
import CircularProgressPage from "../components/CircularProgressPage";
import { ColorContext, initialColorContext } from "../context/colorsContext";

export const ColorProvider = ({ children }: { children: ReactNode }) => {

  const [colors, setColors] = useState<Color[]>(initialColorContext.state.colors);
  const [loadingData, setLoadingData] = useState<boolean>(initialColorContext.state.loadingData);
  const [isCreating, setIsCreating] = useState<boolean>(initialColorContext.state.isCreating);
  const [isUpdating, setIsUpdating] = useState<boolean>(initialColorContext.state.isUpdating);
  const [isDeleting, setIsDeleting] = useState<boolean>(initialColorContext.state.isDeleting);
  const [createError, setCreateError] = useState<string>(
    initialColorContext.state.createError
  );
  const [updateError, setUpdateError] = useState<string>(
    initialColorContext.state.updateError
  );
  const [deleteError, setDeleteError] = useState<string>(
    initialColorContext.state.deleteError
  );
  const [openSnack, setOpenSnack] = useState(initialColorContext.state.openSnack);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        setLoadingData(true);
        const res = await getColors();
        console.log("colorProvider: res.data", res.data);
        setColors(res.data);
        setLoadingData(false);
      } catch (error: Error | any) {
        setLoadingData(false);
      }
    };

    fetchColors();
  }, []);

  const clearErrorsAndCloseSnack = useCallback(() => {
    setCreateError("");
    setUpdateError("");
    setDeleteError("");
    setOpenSnack(false);
  }, [])

  const createNewColor = useCallback(async (colorBody: IColorBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsCreating(true);
      const createResponse = await createColor(colorBody);
      console.log("colorProvider: createNewColor", createResponse);
      const { status, data: color } = createResponse;

      if (color && status === 201) {

        setColors([...colors, color]);

        setIsCreating(false);
        setCreateError("");
        setOpenSnack(true);

      } else {
        setIsCreating(false);
        setCreateError(`Create color faild: ${createResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsCreating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setCreateError(`Create color faild: ${error.response.data.message}`);
      } else {
        setCreateError(`Create color faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [colors, clearErrorsAndCloseSnack]);

  const updateCurrentColor = useCallback(async (colorBody: IColorBody) => {
    try {
      clearErrorsAndCloseSnack();
      setIsUpdating(true);
      const updateResponse = await updateColor(colorBody);
      console.log("colorProvider: updateCurrentColor", updateResponse);
      const { status, data: color } = updateResponse;
      if (color && status === 200) {


        setColors((prevColors) =>{
          return prevColors.map((p) => (p.id === color.id ? color : p));
        });

        setIsUpdating(false);
        setUpdateError("");
        setOpenSnack(true);

      } else {
        setIsUpdating(false);
        setUpdateError(`Update color faild: ${updateResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsUpdating(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setUpdateError(`Update color faild: ${error.response.data.message}`);
      } else {
        setUpdateError(`Update color faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [clearErrorsAndCloseSnack]);

  const deleteCurrentColor = useCallback(async (colorId: string) => {
    try {
      clearErrorsAndCloseSnack();
      setIsDeleting(true);
      const deleteResponse = await deleteColor(colorId);
      console.log("colorProvider: deleteResponse", deleteResponse);
      if (deleteResponse.status === 200) {

        setColors(colors.filter((color) => color.id !== colorId));

        setIsDeleting(false);
        setDeleteError("");
        setOpenSnack(true);

      } else {
        setIsDeleting(false);
        setDeleteError(`Delete color faild: ${deleteResponse.status}`);
        setOpenSnack(true);
      }
    } catch (error: Error | any) {
      setIsDeleting(false);
      if(error?.response && error?.response?.data && error?.response?.data?.message){
        setDeleteError(`Delete color faild: ${error.response.data.message}`);
      } else {
        setDeleteError(`Delete color faild: ${error.message}`);
      }
      setOpenSnack(true);
    }
  }, [colors, clearErrorsAndCloseSnack]);

  const colorContext = useMemo(
    () => ({
      state: {
        colors,
        loadingData,
        isCreating,
        isUpdating,
        isDeleting,
        createError,
        updateError,
        deleteError,
        openSnack,
      },
      actions: { createNewColor, updateCurrentColor, deleteCurrentColor, clearErrorsAndCloseSnack },
    }),
    [
      createNewColor,
      updateCurrentColor,
      deleteCurrentColor,
      clearErrorsAndCloseSnack,
      colors,
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
    <ColorContext.Provider value={colorContext}>
    {loadingData ? <CircularProgressPage /> : children}
    </ColorContext.Provider>
  );
};
  